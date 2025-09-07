
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTransaction = async (data: any) => {
  return await prisma.transaction.create({ data });
};
