import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createListing = async (data: any) => {
  return await prisma.listing.create({ data });
};

export const findListings = async (cursor: number | undefined, limit: number, filters: any) => {
  const where: any = {};

  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.location) {
    where.location = filters.location;
  }
  if (filters.price_min) {
    where.price = { gte: filters.price_min };
  }
  if (filters.price_max) {
    where.price = { ...where.price, lte: filters.price_max };
  }
  if (filters.created_after) {
    where.created_at = { gte: filters.created_after };
  }

  const listings = await prisma.listing.findMany({
    where,
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      created_at: 'desc',
    },
  } as any); // Type assertion to bypass strict typing issues

  const nextCursor = listings.length === limit && listings.length > 0 ? listings[limit - 1]?.id : null;

  return { listings, nextCursor };
};

export const findListingById = async (id: number) => {
  return await prisma.listing.findUnique({ where: { id } });
};

export const updateListing = async (id: number, data: any) => {
  return await prisma.listing.update({ where: { id }, data });
};

export const deleteListing = async (id: number) => {
  return await prisma.listing.delete({ where: { id } });
};