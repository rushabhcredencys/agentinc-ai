"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = __importDefault(require("./config/env"));
const logger_1 = __importDefault(require("./utils/logger"));
const errorHandler_1 = require("./middleware/errorHandler");
const health_1 = __importDefault(require("./routes/health"));
const products_1 = __importDefault(require("./routes/products"));
const agent_1 = __importDefault(require("./routes/agent"));
const app = (0, express_1.default)();
// ============================================================================
// MIDDLEWARE
// ============================================================================
// Security
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Body Parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging middleware
app.use((req, express, next) => {
    logger_1.default.info(`${req.method} ${req.path}`);
    next();
});
// ============================================================================
// ROUTES
// ============================================================================
// Health endpoint
app.use('/health', health_1.default);
// API Routes
app.use('/api/products', products_1.default);
app.use('/api/agent', agent_1.default);
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
        },
        documentation: '/docs',
        specification: 'See config/agent.yaml',
    });
});
// ============================================================================
// ERROR HANDLING
// ============================================================================
app.use(errorHandler_1.errorHandler);
// ============================================================================
// SERVER STARTUP
// ============================================================================
const PORT = env_1.default.app.port;
app.listen(PORT, () => {
    logger_1.default.info(`🚀 Catalog Management Agent Server running on http://localhost:${PORT}`);
    logger_1.default.info(`📚 Open browser to see available endpoints`);
    logger_1.default.info(`📖 Specification: config/agent.yaml`);
    logger_1.default.info(`🔧 Environment: ${env_1.default.app.nodeEnv}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map