import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './api/auth';
import listingRouter from './api/listing';
import messageRouter from './api/message';
import paymentRouter from './api/payment';
import verificationRouter from './api/verification';
import moderationRouter from './api/moderation';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 3000;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(express.json({ 
  verify: (req: Request, res: Response, buf: Buffer) => {
    if (req.originalUrl.startsWith('/webhooks/stripe')) {
      (req as any).rawBody = buf.toString();
    }
  }
}));
app.use(cookieParser());
app.use(limiter);

// API Routes
app.use('/auth', authRouter);
app.use('/api', listingRouter);
app.use('/api', messageRouter);
app.use('/api', paymentRouter);
app.use('/api', verificationRouter);
app.use('/api', moderationRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});