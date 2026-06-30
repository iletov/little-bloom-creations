import { Controller, Get } from '@nestjs/common';
import { GetSanitySenderInfoUseCase } from './use-cases/get-sanity-sender-info.use-case';

@Controller('sanity')
export class SanityController {
  constructor(private readonly getSanitySenderInfoUseCase: GetSanitySenderInfoUseCase) {}

  @Get('sender-ekont')
  async getEkontSender() {
    return this.getSanitySenderInfoUseCase.execute('ekont');
  }

  @Get('sender-speedy')
  async getSpeedySender() {
    return this.getSanitySenderInfoUseCase.execute('speedy');
  }
}
