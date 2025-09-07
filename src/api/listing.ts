
import { Router } from 'express';
import { createListing, getListings, getListingById, updateListing, deleteListing } from '../controllers/listing';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/v1/listings', auth, createListing);
router.get('/v1/listings', getListings);
router.get('/v1/listings/:id', getListingById);
router.put('/v1/listings/:id', auth, updateListing);
router.delete('/v1/listings/:id', auth, deleteListing);

export default router;
