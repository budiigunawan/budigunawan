import { clientAddress, deriveClientKey } from './client-key';
import type { ContactNotifier, ContactStore, StoredContactMessage } from './ports';

export interface ContactConfig {
  /** Origins allowed to submit. Anything else is rejected. */
  readonly allowedOrigins: readonly string[];
  /** Secret used to hash the sender's address into a client key. */
  readonly clientKeySecret: string;
  readonly rateLimit: {
    readonly max: number;
    readonly windowMs: number;
  };
  /** Where a form submission is sent back to. */
  readonly contactPagePath: string;
}

export interface ContactDeps {
  readonly store: ContactStore;
  readonly notifier: ContactNotifier;
  readonly config: ContactConfig;
  /** Injectable clock, so the rolling window is testable without waiting. */
  readonly now?: () => Date;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function textField(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = 'name' | 'email' | 'message';

function normalizeOrigin(value: string): string | undefined {
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

/**
 * A browser sends `Origin` on a cross-origin POST, so a mismatch is enough to
 * reject a forged submission. Requests without either header are not browser
 * navigations (a form always sends one), so they are allowed for tooling.
 */
function originAllowed(request: Request, allowedOrigins: readonly string[]): boolean {
  const allowed = new Set(
    allowedOrigins.map(normalizeOrigin).filter((origin): origin is string => Boolean(origin)),
  );

  const origin = request.headers.get('origin');
  if (origin) return allowed.has(normalizeOrigin(origin) ?? '');

  const referer = request.headers.get('referer');
  if (referer) return allowed.has(normalizeOrigin(referer) ?? '');

  return true;
}

/** The form field a bot fills and a person never sees. */
export const HONEYPOT_FIELD = 'website';

function validate(fields: Record<Field, string>): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};

  if (!fields.name) {
    errors.name = 'Please tell me your name.';
  } else if (fields.name.length > NAME_MAX) {
    errors.name = 'Please keep your name under 100 characters.';
  }

  if (!fields.email) {
    errors.email = 'Please enter your email address.';
  } else if (fields.email.length > EMAIL_MAX || !EMAIL_PATTERN.test(fields.email)) {
    errors.email = 'That email address does not look right.';
  }

  if (!fields.message) {
    errors.message = 'Please write a message.';
  } else if (fields.message.length < MESSAGE_MIN) {
    errors.message = 'Please write at least 10 characters.';
  } else if (fields.message.length > MESSAGE_MAX) {
    errors.message = 'Please keep your message under 5,000 characters.';
  }

  return errors;
}

interface SuccessBody {
  readonly ok: true;
}

interface ErrorBody {
  readonly ok: false;
  readonly errors: Partial<Record<Field | 'form', string>>;
}

type RedirectReason = 'sent' | 'validation' | 'rejected' | 'rate' | 'unavailable' | 'invalid';

function redirectResponse(location: string): Response {
  return new Response(null, {
    status: 303,
    headers: { location, 'cache-control': 'no-store' },
  });
}

function formValues(data: FormData): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const [key, value] of data) {
    if (typeof value === 'string') values[key] = value;
  }
  return values;
}

export async function handleContact(request: Request, deps: ContactDeps): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(null, {
      status: 405,
      headers: { allow: 'POST', 'cache-control': 'no-store' },
    });
  }

  const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
  const isForm =
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data');
  const isJson = contentType.includes('application/json');

  /**
   * JSON callers get a stable JSON body. Form callers get a real navigation
   * back to the Contact page, because the no-JavaScript path cannot read JSON.
   */
  const respond = (status: number, body: SuccessBody | ErrorBody, reason: RedirectReason) => {
    if (isForm) {
      const indicator = reason === 'sent' ? 'sent=1' : `error=${reason}`;
      return redirectResponse(`${deps.config.contactPagePath}?${indicator}`);
    }
    return json(body, status);
  };

  if (!originAllowed(request, deps.config.allowedOrigins)) {
    return respond(
      403,
      { ok: false, errors: { form: 'This form can only be submitted from the site.' } },
      'rejected',
    );
  }

  if (!isForm && !isJson) {
    return respond(415, { ok: false, errors: { form: 'Unsupported request format.' } }, 'invalid');
  }

  let values: Record<string, unknown>;
  try {
    const parsed: unknown = isForm
      ? formValues(await request.formData())
      : await request.json();
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('Body is not an object');
    }
    values = parsed as Record<string, unknown>;
  } catch {
    return respond(
      400,
      { ok: false, errors: { form: 'The message could not be read.' } },
      'invalid',
    );
  }

  // A bot that fills the hidden field gets the same answer as a person, and
  // nothing is stored, so it cannot tell that it was caught.
  if (textField(values[HONEYPOT_FIELD])) {
    return respond(200, { ok: true }, 'sent');
  }

  const fields = {
    name: textField(values.name),
    email: textField(values.email),
    message: textField(values.message),
  };

  const errors = validate(fields);
  if (Object.keys(errors).length > 0) {
    return respond(400, { ok: false, errors }, 'validation');
  }

  const clientKey = deriveClientKey(clientAddress(request), deps.config.clientKeySecret);
  const now = deps.now?.() ?? new Date();
  const windowStart = new Date(now.getTime() - deps.config.rateLimit.windowMs);

  let stored: StoredContactMessage;
  try {
    const recent = await deps.store.countSince(clientKey, windowStart);
    if (recent >= deps.config.rateLimit.max) {
      return respond(
        429,
        {
          ok: false,
          errors: { form: 'Too many messages from this browser. Please try again later.' },
        },
        'rate',
      );
    }

    stored = await deps.store.save({ ...fields, clientKey });
  } catch (error) {
    console.error(
      `[contact] storing failed: ${error instanceof Error ? error.name : 'unknown error'}`,
    );
    return respond(
      500,
      { ok: false, errors: { form: 'Something went wrong. Please try again.' } },
      'unavailable',
    );
  }

  try {
    await deps.notifier.notify(stored);
  } catch (error) {
    // The message is already safe. Name it so a missed notification can be
    // recovered, but never log the body or the sender.
    console.error(
      `[contact] notification failed for ${stored.id}: ${
        error instanceof Error ? error.name : 'unknown error'
      }`,
    );
  }

  return respond(200, { ok: true }, 'sent');
}
