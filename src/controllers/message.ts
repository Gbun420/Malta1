import { Request, Response } from 'express';
import * as messageRepository from '../repositories/message.repository';
import * as listingRepository from '../repositories/listing.repository';
import * as analytics from '../services/analytics.service';
import { problemDetails } from '../utils/problemDetails';

// Simple profanity filter stub
const containsProfanity = (text: string) => {
  const profanities = ['badword1', 'badword2']; // TODO: Load from a proper list
  return profanities.some(word => text.toLowerCase().includes(word));
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const { receiverId, content } = req.body;
    const senderId = (req as any).userId; // Assuming userId is set by auth middleware

    // Validate required parameters
    if (!listingId) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Listing ID is required',
        req.originalUrl
      ));
    }
    const listingIdNum = parseInt(listingId);
    if (isNaN(listingIdNum)) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Invalid listing ID',
        req.originalUrl
      ));
    }

    if (!receiverId) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Receiver ID is required',
        req.originalUrl
      ));
    }

    if (!content) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Content is required',
        req.originalUrl
      ));
    }

    // Check if listing exists and is active
    const listing = await listingRepository.findListingById(listingIdNum);
    if (!listing || listing.status !== 'ACTIVE') {
      return res.status(404).json(problemDetails(
        404,
        '/problems/not-found',
        'Not Found',
        'Listing not found or not active',
        req.originalUrl
      ));
    }

    const message = await messageRepository.createMessage({
      listing_id: listingIdNum,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    });

    // Emit analytics event
    // Check if this is the first message in the thread
    const existingMessages = await messageRepository.findMessages(listingIdNum, undefined, 1);
    if (existingMessages.messages.length === 0) {
      analytics.trackEvent('contact_seller', { listing_id: listing.id, buyer_id: senderId, seller_id: receiverId });
    } else {
      analytics.trackEvent('seller_reply', { listing_id: listing.id, buyer_id: senderId, seller_id: receiverId });
    }

    res.status(201).json(message);
  } catch (error: any) {
    console.error('Error creating message:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const userId = (req as any).userId; // Assuming userId is set by auth middleware

    // Validate required parameters
    if (!listingId) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Listing ID is required',
        req.originalUrl
      ));
    }
    const listingIdNum = parseInt(listingId);
    if (isNaN(listingIdNum)) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Invalid listing ID',
        req.originalUrl
      ));
    }

    // Check if the user is a participant in the conversation
    const listing = await listingRepository.findListingById(listingIdNum);
    if (!listing) {
      return res.status(404).json(problemDetails(
        404,
        '/problems/not-found',
        'Not Found',
        'Listing not found',
        req.originalUrl
      ));
    }

    // TODO: Implement logic to check if userId is sender or receiver of any message in this thread
    // For now, assuming if you can see the listing, you can see messages

    const { messages, nextCursor } = await messageRepository.findMessages(listingIdNum, cursor, limit);

    res.json({
      data: messages,
      pagination: {
        next_cursor: nextCursor,
        has_next_page: !!nextCursor,
      },
    });
  } catch (error: any) {
    console.error('Error getting messages:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};
