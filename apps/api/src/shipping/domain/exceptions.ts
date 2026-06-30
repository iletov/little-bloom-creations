import { HttpException, HttpStatus } from '@nestjs/common';

export class ShippingProviderException extends HttpException {
  constructor(message: string, public readonly rawError?: Record<string, unknown> | unknown) {
    super(
      {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: `Shipping Provider Error: ${message}`,
        error: 'Bad Gateway',
        rawError,
      },
      HttpStatus.BAD_GATEWAY,
    );
  }
}
