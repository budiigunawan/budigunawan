import { PrismaClient } from '@prisma/client';

import { site } from '../../config/site';
import { contactConfigFromEnv, databaseUrlFromEnv, type ContactEnv } from './config';
import type { ContactDeps } from './handler';
import type { ContactNotifier } from './ports';
import { createPrismaContactStore } from './prisma-store';
import { createResendNotifier } from './resend-notifier';

let prisma: PrismaClient | undefined;

function notifierFromEnv(env: ContactEnv): ContactNotifier {
  if (env.VERCEL_ENV === 'preview') {
    // A preview database is separate from production, and a preview must never
    // email the real inbox: a test submission stops at the log.
    return {
      async notify(message) {
        console.info(`[contact] preview stored ${message.id}; notification skipped`);
      },
    };
  }

  const apiKey = env.RESEND_API_KEY;
  const from = env.CONTACT_EMAIL_FROM;
  if (!apiKey || !from) {
    return {
      async notify(message) {
        console.warn(`[contact] mail is not configured; ${message.id} was not notified`);
      },
    };
  }

  return createResendNotifier({ apiKey, from, to: env.CONTACT_EMAIL_TO ?? site.email });
}

/**
 * Builds the endpoint's two ports from the environment. The Prisma client is
 * created lazily and reused across invocations in the same serverless instance.
 */
export function contactDepsFromEnv(env: ContactEnv = process.env): ContactDeps {
  prisma ??= new PrismaClient({ datasourceUrl: databaseUrlFromEnv(env) });

  return {
    store: createPrismaContactStore(prisma),
    notifier: notifierFromEnv(env),
    config: contactConfigFromEnv(env),
  };
}
