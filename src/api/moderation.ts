
import { Router } from 'express';
import { reportListing, reportMessage, openDispute, resolveDispute } from '../controllers/moderation';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/v1/listings/:listingId/report', auth, reportListing);
router.post('/v1/messages/:messageId/report', auth, reportMessage);
router.post('/v1/transactions/:transactionId/dispute', auth, openDispute);
router.post('/v1/disputes/:disputeId/resolve', auth, resolveDispute); // This would typically be an admin route

export default router;
