import { SyncSanityProductUseCase, type SanityWebhookPayload } from './use-cases/sync-sanity-product.use-case';
export declare class SanityWebhooksController {
    private readonly syncSanityProductUseCase;
    constructor(syncSanityProductUseCase: SyncSanityProductUseCase);
    handleWebhook(signature: string, payload: SanityWebhookPayload): Promise<{
        success: boolean;
        message: string;
    }>;
}
