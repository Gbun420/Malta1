import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createVerification = async (data: any) => {
  return await prisma.verification.create({ data });
};

export const findVerificationByUserId = async (userId: number) => {
  return await prisma.verification.findUnique({ where: { user_id: userId } });
};

export const updateVerificationStatus = async (id: number, status: string) => {
  return await prisma.verification.update({ where: { id }, data: { status: status as any } });
};