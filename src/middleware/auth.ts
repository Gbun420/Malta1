
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { code: 'unauthorized', message: 'Unauthorized' } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    // You can attach the decoded payload to the request object for later use
    // (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: { code: 'unauthorized', message: 'Invalid token' } });
  }
};
