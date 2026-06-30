import { GetSanitySenderInfoUseCase } from './use-cases/get-sanity-sender-info.use-case';
export declare class SanityController {
    private readonly getSanitySenderInfoUseCase;
    constructor(getSanitySenderInfoUseCase: GetSanitySenderInfoUseCase);
    getEkontSender(): Promise<any>;
    getSpeedySender(): Promise<any>;
}
