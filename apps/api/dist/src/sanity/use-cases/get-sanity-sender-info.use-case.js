"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GetSanitySenderInfoUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSanitySenderInfoUseCase = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GetSanitySenderInfoUseCase = GetSanitySenderInfoUseCase_1 = class GetSanitySenderInfoUseCase {
    configService;
    logger = new common_1.Logger(GetSanitySenderInfoUseCase_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async execute(type) {
        const projectId = this.configService.get('SANITY_PROJECT_ID') || 'wv9xoozi';
        const dataset = this.configService.get('SANITY_DATASET') || 'production';
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
        }
        catch (error) {
            this.logger.error(`Error fetching from Sanity for ${type}:`, error);
            return null;
        }
    }
};
exports.GetSanitySenderInfoUseCase = GetSanitySenderInfoUseCase;
exports.GetSanitySenderInfoUseCase = GetSanitySenderInfoUseCase = GetSanitySenderInfoUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GetSanitySenderInfoUseCase);
//# sourceMappingURL=get-sanity-sender-info.use-case.js.map