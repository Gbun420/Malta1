
import { Router } from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/payment';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/v1/payments/intent', auth, createPaymentIntent);
router.post('/webhooks/stripe', handleWebhook);

export default router;
