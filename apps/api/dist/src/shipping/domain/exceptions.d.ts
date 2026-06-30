import { HttpException } from '@nestjs/common';
export declare class ShippingProviderException extends HttpException {
    readonly rawError?: (Record<string, unknown> | unknown) | undefined;
    constructor(message: string, rawError?: (Record<string, unknown> | unknown) | undefined);
}
