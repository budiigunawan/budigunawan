import type { PrismaClient } from '@prisma/client';

import type { ContactStore } from './ports';

export function createPrismaContactStore(prisma: PrismaClient): ContactStore {
  return {
    async save(draft) {
      const stored = await prisma.contactMessage.create({ data: { ...draft } });
      return stored;
    },

    async countSince(clientKey, since) {
      return prisma.contactMessage.count({
        where: { clientKey, createdAt: { gte: since } },
      });
    },
  };
}
