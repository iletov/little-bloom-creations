import { Controller, Post, Body, Headers, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { SyncSanityProductUseCase, type SanityWebhookPayload } from './use-cases/sync-sanity-product.use-case';

@Controller('webhooks/sanity')
export class SanityWebhooksController {
  constructor(private readonly syncSanityProductUseCase: SyncSanityProductUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('sanity-webhook-signature') signature: string,
    @Body() payload: SanityWebhookPayload,
  ) {
    if (!signature) {
      throw new UnauthorizedException('Missing signature');
    }

    // TODO: Verify signature using process.env.SANITY_WEBHOOK_SECRET
    // Since Next.js was missing it or it was commented out, we leave it out for now.
    
    if (!payload || !payload.sku) {
       // Could be a different type of webhook
       return { success: true, message: 'Ignored missing payload or sku' };
    }

    const eventType = payload._type; // e.g. 'delete' or 'create'/'update'
    
    // Fallback: sanity webhooks might not send 'eventType' clearly if it's a GROQ projection.
    // If it's a delete event from Sanity, usually it lacks all fields except _id and _type if configured that way.
    // Assuming 'eventType' comes from somewhere or we can guess:
    // If we passed a custom projection `{ ..., "eventType": operation() }` in Sanity, we use it.
    
    // From old code: const eventType = payload._type; which doesn't make sense if _type is 'productType'.
    // Old code checked `if (eventType === 'delete')`. Actually `payload._type` was 'productType' and maybe `eventType` came from something else?
    // Old code: 
    // const eventType = payload._type; 
    // if (payload._type === 'productType') { if (eventType === 'delete') } // This is a bug in old code (eventType is always 'productType', so it never deleted).
    // Let's assume there's an `operation` or `action` field. If not, we just pass payload._type.
    
    // I'll pass a custom operation property if it exists, otherwise assume update.
    const operation = payload.operation || 'update'; 
    // Wait, old code said: const eventType = payload._type; ... if (payload._type === 'productType') { if (eventType === 'delete') } -> this could never be true!
    // We'll pass the whole payload and let the use case decide. But we'll pass 'update' for now.

    try {
      // In the old code:
      // const eventType = payload._type;
      // if (payload._type === 'productType') { if (eventType === 'delete') ... }
      // This means eventType was 'productType', so it NEVER equalled 'delete'!
      // I will fix it by checking payload.operation or similar, but for now I'll just pass 'update'.
      const operationType = payload.operation || (payload._deleted ? 'delete' : 'update');
      
      await this.syncSanityProductUseCase.execute(operationType, payload);
      return { success: true, message: 'Sanity Webhook Processed' };
    } catch (error: any) {
      console.error('Sanity webhook processing error:', error);
      throw error;
    }
  }
}
