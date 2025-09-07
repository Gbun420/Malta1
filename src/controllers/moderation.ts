import { Request, Response } from 'express';
import * as analytics from '../services/analytics.service';
import { problemDetails } from '../utils/problemDetails';

// Placeholder for a simple in-memory report/dispute store
const reports: any[] = [];
const disputes: any[] = [];

export const reportListing = async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const { reason, description } = req.body;
    const userId = (req as any).userId; // Assuming userId is set by auth middleware

    if (!listingId) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Missing listing ID',
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

    if (!reason) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Missing report reason',
        req.originalUrl
      ));
    }

    const report = {
      id: reports.length + 1,
      listing_id: listingIdNum,
      reporter_id: userId,
      reason,
      description,
      status: 'OPEN',
      created_at: new Date(),
    };
    reports.push(report);

    analytics.trackEvent('report_submitted', { report_type: 'listing', reason, listing_id: listingId });

    res.status(202).json({ message: 'Report received. Our team will review it shortly.' });
  } catch (error: any) {
    console.error('Error reporting listing:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};

export const reportMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { reason } = req.body;
    const userId = (req as any).userId; // Assuming userId is set by auth middleware

    if (!messageId) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Missing message ID',
        req.originalUrl
      ));
    }
    const messageIdNum = parseInt(messageId);
    if (isNaN(messageIdNum)) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Invalid message ID',
        req.originalUrl
      ));
    }

    if (!reason) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Missing report reason',
        req.originalUrl
      ));
    }

    const report = {
      id: reports.length + 1,
      message_id: messageIdNum,
      reporter_id: userId,
      reason,
      status: 'OPEN',
      created_at: new Date(),
    };
    reports.push(report);

    analytics.trackEvent('report_submitted', { report_type: 'message', reason, message_id: messageId });

    res.status(202).json({ message: 'Report received. Our team will review it shortly.' });
  } catch (error: any) {
    console.error('Error reporting message:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};

export const openDispute = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { reason, evidence } = req.body;
    const userId = (req as any).userId; // Assuming userId is set by auth middleware

    if (!transactionId) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Missing transaction ID',
        req.originalUrl
      ));
    }
    const transactionIdNum = parseInt(transactionId);
    if (isNaN(transactionIdNum)) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Invalid transaction ID',
        req.originalUrl
      ));
    }

    if (!reason) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Missing dispute reason',
        req.originalUrl
      ));
    }

    const dispute = {
      id: disputes.length + 1,
      transaction_id: transactionIdNum,
      initiator_id: userId,
      reason,
      evidence,
      status: 'OPEN',
      created_at: new Date(),
    };
    disputes.push(dispute);

    analytics.trackEvent('dispute_opened', { transaction_id: transactionId, reason });

    res.status(202).json({ message: 'Dispute opened. Our team will review it shortly.' });
  } catch (error: any) {
    console.error('Error opening dispute:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};

export const resolveDispute = async (req: Request, res: Response) => {
  try {
    const { disputeId } = req.params;
    const { resolution } = req.body; // e.g., 'refunded', 'paid_out', 'no_action'

    if (!disputeId) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Missing dispute ID',
        req.originalUrl
      ));
    }
    const disputeIdNum = parseInt(disputeId);
    if (isNaN(disputeIdNum)) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Invalid dispute ID',
        req.originalUrl
      ));
    }

    const dispute = disputes.find(d => d.id === disputeIdNum);
    if (!dispute) {
      return res.status(404).json(problemDetails(
        404,
        '/problems/not-found',
        'Not Found',
        'Dispute not found',
        req.originalUrl
      ));
    }

    dispute.status = 'RESOLVED';
    dispute.resolution = resolution;
    dispute.resolved_at = new Date();

    analytics.trackEvent('dispute_resolved', { dispute_id: disputeId, resolution });

    res.json({ message: 'Dispute resolved.' });
  } catch (error: any) {
    console.error('Error resolving dispute:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};
