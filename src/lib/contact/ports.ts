/** The Contact Message as it arrives, after validation, before it is stored. */
export interface ContactMessageDraft {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  /** A keyed hash of the sender's address; never the address itself. */
  readonly clientKey: string;
}

export interface StoredContactMessage extends ContactMessageDraft {
  readonly id: string;
  readonly createdAt: Date;
}

/**
 * The endpoint's storage port. The Prisma implementation is used in production;
 * tests substitute a fake, so no test opens a database.
 */
export interface ContactStore {
  save(draft: ContactMessageDraft): Promise<StoredContactMessage>;
  /** How many messages this client key stored at or after `since`. */
  countSince(clientKey: string, since: Date): Promise<number>;
}

/**
 * The endpoint's notification port. The Resend implementation is used in
 * production; tests substitute a fake, so no test opens a network connection.
 */
export interface ContactNotifier {
  notify(message: StoredContactMessage): Promise<void>;
}
