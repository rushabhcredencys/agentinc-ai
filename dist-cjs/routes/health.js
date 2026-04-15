"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * Health check endpoint
 * GET /health
 */
router.get('/health', (req, res) => {
    return res.json({
        success: true,
        message: 'Catalog Management Agent is running',
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});
exports.default = router;
//# sourceMappingURL=health.js.map