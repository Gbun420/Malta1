
import { Router } from 'express';
import { createMessage, getMessages } from '../controllers/message';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/v1/listings/:listingId/messages', auth, createMessage);
router.get('/v1/listings/:listingId/messages', auth, getMessages);

export default router;
