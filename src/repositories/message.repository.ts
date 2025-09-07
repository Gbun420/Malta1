
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMessage = async (data: any) => {
  return await prisma.message.create({ data });
};

export const findMessages = async (listingId: number, cursor: number | undefined, limit: number) => {
  const messages = await prisma.message.findMany({
    where: { listing_id: listingId },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      created_at: 'desc',
    },
  } as any); // Type assertion to bypass strict typing issues

  const nextCursor = messages.length === limit && messages.length > 0 ? messages[limit - 1]?.id : null;

  return { messages, nextCursor };
};
