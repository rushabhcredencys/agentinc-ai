import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health check endpoint
 * GET /
 */
router.get('/', (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Catalog Management Agent is running',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;
