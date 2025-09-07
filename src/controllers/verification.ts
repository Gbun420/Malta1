
import { Request, Response } from 'express';
import * as verificationRepository from '../repositories/verification.repository';
import * as userRepository from '../repositories/user.repository';
import * as analytics from '../services/analytics.service';
import { problemDetails } from '../utils/problemDetails';

// Placeholder for Persona/Onfido SDK integration
const personaService = {
  initiateVerification: async (userId: number, userData: any) => {
    console.log(`Initiating Persona verification for user ${userId} with data:`, userData);
    // In a real scenario, this would call Persona's API
    return { verificationId: `persona_${userId}_${Date.now()}`, status: 'pending' };
  },
  getVerificationStatus: async (verificationId: string) => {
    console.log(`Getting Persona verification status for ${verificationId}`);
    // In a real scenario, this would call Persona's API
    // Simulate status change
    const statuses = ['pending', 'verified', 'rejected'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    return { status: randomStatus, reason: randomStatus === 'rejected' ? 'ID not clear' : undefined };
  },
};

const onfidoService = {
  initiateVerification: async (userId: number, userData: any) => {
    console.log(`Initiating Onfido verification for user ${userId} with data:`, userData);
    // In a real scenario, this would call Onfido's API
    return { verificationId: `onfido_${userId}_${Date.now()}`, status: 'pending' };
  },
  getVerificationStatus: async (verificationId: string) => {
    console.log(`Getting Onfido verification status for ${verificationId}`);
    // In a real scenario, this would call Onfido's API
    // Simulate status change
    const statuses = ['pending', 'verified', 'rejected'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    return { status: randomStatus, reason: randomStatus === 'rejected' ? 'Document expired' : undefined };
  },
};

// Feature flag for verification
const VERIFY_ENABLED = process.env.VERIFY_ENABLED === 'true';

export const initiateVerification = async (req: Request, res: Response) => {
  if (!VERIFY_ENABLED) {
    return res.status(503).json(problemDetails(
      503,
      '/problems/service-unavailable',
      'Service Unavailable',
      'Verification service is currently disabled',
      req.originalUrl
    ));
  }

  try {
    const userId = (req as any).userId; // Assuming userId is set by auth middleware
    const { documentType, documentUrl } = req.body;

    if (!documentType || !documentUrl) {
      return res.status(400).json(problemDetails(
        400,
        '/problems/bad-request',
        'Bad Request',
        'Missing documentType or documentUrl',
        req.originalUrl
      ));
    }

    // Choose provider (e.g., based on config or user preference)
    const provider = 'persona'; // or 'onfido'
    let verificationResult;

    if (provider === 'persona') {
      verificationResult = await personaService.initiateVerification(userId, { documentType, documentUrl });
    } else if (provider === 'onfido') {
      verificationResult = await onfidoService.initiateVerification(userId, { documentType, documentUrl });
    }

    const verification = await verificationRepository.createVerification({
      user_id: userId,
      status: verificationResult?.status || 'PENDING',
      document_type: documentType,
      document_url: documentUrl,
    });

    analytics.trackEvent('kyc_started', { userId, provider });

    res.status(202).json({ verificationId: verification.id, status: verification.status });
  } catch (error: any) {
    console.error('Error initiating verification:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};

export const getVerificationStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Assuming userId is set by auth middleware
    const verification = await verificationRepository.findVerificationByUserId(userId);

    if (!verification) {
      return res.status(404).json(problemDetails(
        404,
        '/problems/not-found',
        'Not Found',
        'Verification record not found for this user',
        req.originalUrl
      ));
    }

    // Poll provider for latest status (in a real app, this would be handled by webhooks)
    const provider = 'persona'; // or 'onfido'
    let providerStatus;

    if (provider === 'persona') {
      providerStatus = await personaService.getVerificationStatus(verification.id.toString()); // Assuming ID can be used as verificationId
    } else if (provider === 'onfido') {
      providerStatus = await onfidoService.getVerificationStatus(verification.id.toString());
    }

    // Update local status if changed
    if (providerStatus && providerStatus.status) {
      const upperCaseStatus = providerStatus.status.toUpperCase();
      if (upperCaseStatus !== verification.status) {
        await verificationRepository.updateVerificationStatus(verification.id, upperCaseStatus as any);
        verification.status = upperCaseStatus as any; // Update in memory for response
        analytics.trackEvent('kyc_completed', { userId, status: verification.status });
      }
    }

    res.json({ status: verification.status, reason: providerStatus?.reason });
  } catch (error: any) {
    console.error('Error getting verification status:', error);
    res.status(500).json(problemDetails(
      500,
      '/problems/internal-server-error',
      'Internal Server Error',
      error.message || 'An unexpected error occurred',
      req.originalUrl
    ));
  }
};
