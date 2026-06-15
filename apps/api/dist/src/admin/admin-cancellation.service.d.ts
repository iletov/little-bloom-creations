import { AdminRepository } from './admin.repository';
import { StripeService } from '../stripe/stripe.service';
export declare class AdminCancellationService {
    private readonly stripeService;
    private readonly adminRepository;
    private readonly logger;
    constructor(stripeService: StripeService, adminRepository: AdminRepository);
    cancelOrder(orderId: string): Promise<{
        success: boolean;
        message: string;
        order: {
            id: string;
            orderNumber: string;
            createdAt: Date;
            status: "pending" | "confirmed" | "shipped" | "refunded" | "cancelled";
            totalAmount: string;
            subtotal: string;
            deliveryCost: string;
            deliveryMethod: import("@repo/shared-types").DeliveryMethodEnum;
            paymentMethod: import("@repo/shared-types").PaymentMethodEnum;
            shipmentNumber: string | null;
            stripePaymentIntentId: string | null;
        };
    }>;
}
