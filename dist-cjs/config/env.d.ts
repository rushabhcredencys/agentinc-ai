export declare const config: {
    app: {
        nodeEnv: string;
        port: number;
        logLevel: string;
    };
    database: {
        url: string;
        replicaUrl: string;
    };
    queue: {
        rabbitmqUrl: string;
        redisUrl: string;
    };
    apis: {
        openaiKey: string;
        huggingfaceKey: string;
    };
    agent: {
        confidenceThreshold: number;
        bulkApprovalThreshold: number;
    };
};
export default config;
//# sourceMappingURL=env.d.ts.map