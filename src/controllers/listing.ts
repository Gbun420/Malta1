import { Request, Response } from 'express';
import * as listingRepository from '../repositories/listing.repository';
import * as analytics from '../services/analytics.service';
import { problemDetails } from '../utils/problemDetails';

export const createListing = async (req: Request, res: Response) => {
  try {
    // TODO: Add comprehensive validation using a library like Joi or Zod
    const { title, description, price, category, condition, brand, model, serial_number, location, seller_id } = req.body;

    if (!title || !price || !category || !seller_id) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Missing required fields',
        req.originalUrl
      ));
    }

    const listing = await listingRepository.createListing({ title, description, price, category, condition, brand, model, serial_number, location, seller_id });

    analytics.trackEvent('create_listing', { listing_id: listing.id, category: listing.category, price: listing.price });

    res.status(201).json(listing);
  } catch (error: any) {
    console.error('Error creating listing:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};

export const getListings = async (req: Request, res: Response) => {
  try {
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const category = req.query.category as string;
    const location = req.query.location as string;
    const price_min = req.query.price_min ? parseInt(req.query.price_min as string) : undefined;
    const price_max = req.query.price_max ? parseInt(req.query.price_max as string) : undefined;
    const created_after = req.query.created_after ? new Date(req.query.created_after as string) : undefined;

    const filters = {
      category,
      location,
      price_min,
      price_max,
      created_after,
    };

    const { listings, nextCursor } = await listingRepository.findListings(cursor, limit, filters);

    analytics.trackEvent('view_item_list', { category, location, price_min, price_max });

    res.json({
      data: listings,
      pagination: {
        next_cursor: nextCursor,
        has_next_page: !!nextCursor,
      },
    });
  } catch (error: any) {
    console.error('Error getting listings:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};

export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Listing ID is required',
        req.originalUrl
      ));
    }
    const listingId = parseInt(id);
    if (isNaN(listingId)) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Invalid listing ID',
        req.originalUrl
      ));
    }
    const listing = await listingRepository.findListingById(listingId);

    if (!listing) {
      return res.status(404).json(problemDetails(
        404,
        '/problems/not-found',
        'Not Found',
        'Listing not found',
        req.originalUrl
      ));
    }

    analytics.trackEvent('view_item', { listing_id: listing.id, category: listing.category, price: listing.price });

    res.json(listing);
  } catch (error: any) {
    console.error('Error getting listing by ID:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};

export const updateListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Listing ID is required',
        req.originalUrl
      ));
    }
    const listingId = parseInt(id);
    if (isNaN(listingId)) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Invalid listing ID',
        req.originalUrl
      ));
    }
    // TODO: Add validation
    const updatedListing = await listingRepository.updateListing(listingId, req.body);

    if (!updatedListing) {
      return res.status(404).json(problemDetails(
        404,
        '/problems/not-found',
        'Not Found',
        'Listing not found',
        req.originalUrl
      ));
    }

    res.json(updatedListing);
  } catch (error: any) {
    console.error('Error updating listing:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Listing ID is required',
        req.originalUrl
      ));
    }
    const listingId = parseInt(id);
    if (isNaN(listingId)) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Invalid listing ID',
        req.originalUrl
      ));
    }
    const deletedListing = await listingRepository.deleteListing(listingId);

    if (!deletedListing) {
      return res.status(404).json(problemDetails(
        404,
        '/problems/not-found',
        'Not Found',
        'Listing not found',
        req.originalUrl
      ));
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting listing:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};
