
import { Router } from 'express';
import { initiateVerification, getVerificationStatus } from '../controllers/verification';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/v1/verification', auth, initiateVerification);
router.get('/v1/verification', auth, getVerificationStatus);

export default router;
