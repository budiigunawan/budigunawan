import type { ContactNotifier } from './ports';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export interface ResendNotifierOptions {
  readonly apiKey: string;
  readonly from: string;
  readonly to: string;
}

/**
 * Sends the new-message email through Resend's HTTP API. A non-2xx answer
 * throws, which the endpoint treats as a degradation rather than a failure.
 */
export function createResendNotifier(options: ResendNotifierOptions): ContactNotifier {
  return {
    async notify(message) {
      const response = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${options.apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: options.from,
          to: [options.to],
          reply_to: message.email,
          subject: `New Contact Message from ${message.name.replace(/\s+/g, ' ')}`,
          text: [
            `From: ${message.name} <${message.email}>`,
            `Stored message: ${message.id}`,
            '',
            message.message,
          ].join('\n'),
        }),
      });

      if (!response.ok) {
        throw new Error(`Resend responded with ${response.status}`);
      }
    },
  };
}
