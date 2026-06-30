import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetSanitySenderInfoUseCase {
  private readonly logger = new Logger(GetSanitySenderInfoUseCase.name);

  constructor(private readonly configService: ConfigService) {}

  async execute(type: 'ekont' | 'speedy'): Promise<any> {
    const projectId = this.configService.get<string>('SANITY_PROJECT_ID') || 'wv9xoozi';
    const dataset = this.configService.get<string>('SANITY_DATASET') || 'production';
    const apiVersion = '2023-05-03';
    
    const queryType = type === 'ekont' ? 'ekontSenderDetails' : 'speedySenderDetails';
    const query = encodeURIComponent(`*[_type == "${queryType}"][0]`);
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
         this.logger.error(`Failed to fetch sanity data for ${type}: ${response.statusText}`);
         return null;
      }
      const data = await response.json();
      return data.result || null;
    } catch (error) {
      this.logger.error(`Error fetching from Sanity for ${type}:`, error);
      return null;
    }
  }
}
