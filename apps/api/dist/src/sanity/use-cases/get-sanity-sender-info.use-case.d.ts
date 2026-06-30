import { ConfigService } from '@nestjs/config';
export declare class GetSanitySenderInfoUseCase {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    execute(type: 'ekont' | 'speedy'): Promise<any>;
}
