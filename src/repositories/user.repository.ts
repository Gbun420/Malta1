
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (data: any) => {
  return await prisma.user.create({ data });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};
