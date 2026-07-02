"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const parsePort = (value) => {
    if (!value) {
        return 3001;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`Invalid PORT value: ${value}`);
    }
    return parsed;
};
const parseAllowedOrigins = () => {
    const rawOrigins = process.env.CORS_ORIGINS ?? process.env.FRONTEND_URL ?? '';
    const configuredOrigins = rawOrigins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    if (configuredOrigins.length > 0) {
        return configuredOrigins;
    }
    if (process.env.NODE_ENV !== 'production') {
        return [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
        ];
    }
    return [];
};
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    const allowedOrigins = parseAllowedOrigins();
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`CORS blocked for origin: ${origin}`), false);
        },
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const port = parsePort(process.env.PORT);
    await app.listen(port, '0.0.0.0');
}
void bootstrap();
//# sourceMappingURL=main.js.map