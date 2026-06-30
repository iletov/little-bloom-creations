import { ConfigService } from '@nestjs/config';
import { GetSanitySenderInfoUseCase } from '../sanity/use-cases/get-sanity-sender-info.use-case';
import { AdminRepository } from './admin.repository';
export declare class AdminWaybillService {
    private readonly configService;
    private readonly getSanitySenderInfoUseCase;
    private readonly adminRepository;
    private readonly logger;
    constructor(configService: ConfigService, getSanitySenderInfoUseCase: GetSanitySenderInfoUseCase, adminRepository: AdminRepository);
    generateWaybill(orderId: string): Promise<{
        success: boolean;
        shipmentNumber: string | null;
        shipmentData: any;
    }>;
    private generateEkontWaybill;
    private generateSpeedyWaybill;
}
