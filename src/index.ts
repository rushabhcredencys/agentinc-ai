// Polyfill for fetch in Node.js < 18
import fetch, { Response, Request, Headers } from 'node-fetch';
if (!globalThis.fetch) {
  (globalThis as any).fetch = fetch;
  (globalThis as any).Response = Response;
  (globalThis as any).Request = Request;
  (globalThis as any).Headers = Headers;
}

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import config from './config/env';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import productsRoutes from './routes/products';
import agentRoutes from './routes/agent';
import descriptionsRoutes from './routes/descriptions';

const app: Express = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security
app.use(helmet());
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, '../public')));

// Logging middleware
app.use((req, express, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

// Health endpoint
app.use('/health', healthRoutes);

// API Routes
app.use('/api/products', productsRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/descriptions', descriptionsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Catalog Management Agent API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      products: {
        getAll: 'GET /api/products',
        getById: 'GET /api/products/:id',
        create: 'POST /api/products',
        update: 'PATCH /api/products/:id',
      },
      agent: {
        classify: 'POST /api/agent/classify',
        tag: 'POST /api/agent/tag',
        sequenceImages: 'POST /api/agent/sequence-images',
        checkQuality: 'POST /api/agent/check-quality',
        bulkUpdate: 'POST /api/agent/bulk-update',
      },
      descriptions: {
        generateFromApi: 'POST /api/descriptions/generate',
        generateFromData: 'POST /api/descriptions/generate-from-data',
      },
    },
    documentation: '/docs',
    specification: 'See config/agent.yaml',
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

if (!process.env.VERCEL) {
  const PORT = config.app.port;
  app.listen(PORT, () => {
    logger.info(`🚀 Catalog Management Agent Server running on http://localhost:${PORT}`);
    logger.info(`📚 Open browser to see available endpoints`);
    logger.info(`📖 Specification: config/agent.yaml`);
    logger.info(`🔧 Environment: ${config.app.nodeEnv}`);
  });
}

export default app;
