"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    app: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT || '3000', 10),
        logLevel: process.env.AGENT_LOG_LEVEL || 'info',
    },
    database: {
        url: process.env.DATABASE_URL || 'postgresql://localhost/catalog_agent_db',
        replicaUrl: process.env.DATABASE_REPLICA_URL || 'postgresql://localhost/catalog_agent_readonly',
    },
    queue: {
        rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
        redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    apis: {
        openaiKey: process.env.OPENAI_API_KEY || '',
        huggingfaceKey: process.env.HUGGINGFACE_API_KEY || '',
        claudeKey: process.env.CLAUDE_API_KEY || '',
        geminiKey: process.env.GEMINI_API_KEY || '',
    },
    agent: {
        confidenceThreshold: parseFloat(process.env.AGENT_CONFIDENCE_THRESHOLD || '0.8'),
        bulkApprovalThreshold: parseInt(process.env.AGENT_BULK_APPROVAL_THRESHOLD || '1000', 10),
    },
};
exports.default = exports.config;
//# sourceMappingURL=env.js.map