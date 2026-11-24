import type { APIRoute } from 'astro';

import { CONTACT_PAGE_PATH } from '../../lib/contact/config';
import { handleContact } from '../../lib/contact/handler';
import { contactDepsFromEnv } from '../../lib/contact/server';

// The site's one runtime surface: every other route is prerendered.
export const prerender = false;

function failure(request: Request): Response {
  const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    // A form caller cannot read JSON, so a configuration failure still has to
    // be a navigation. The contact page renders the indicator.
    return new Response(null, {
      status: 303,
      headers: {
        location: `${CONTACT_PAGE_PATH}?error=unavailable`,
        'cache-control': 'no-store',
      },
    });
  }

  return new Response(
    JSON.stringify({ ok: false, errors: { form: 'Something went wrong. Please try again.' } }),
    {
      status: 500,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    },
  );
}

export const POST: APIRoute = async ({ request }) => {
  try {
    return await handleContact(request, contactDepsFromEnv());
  } catch (error) {
    // Configuration can fail before the handler runs; answer generically and
    // keep the detail out of the response. The error's name is safe to log.
    console.error(
      `[contact] request failed: ${error instanceof Error ? error.name : 'unknown error'}`,
    );
    return failure(request);
  }
};
