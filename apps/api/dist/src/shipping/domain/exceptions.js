"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingProviderException = void 0;
const common_1 = require("@nestjs/common");
class ShippingProviderException extends common_1.HttpException {
    rawError;
    constructor(message, rawError) {
        super({
            statusCode: common_1.HttpStatus.BAD_GATEWAY,
            message: `Shipping Provider Error: ${message}`,
            error: 'Bad Gateway',
            rawError,
        }, common_1.HttpStatus.BAD_GATEWAY);
        this.rawError = rawError;
    }
}
exports.ShippingProviderException = ShippingProviderException;
//# sourceMappingURL=exceptions.js.map