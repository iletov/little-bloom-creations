"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const orders_controller_1 = require("./orders.controller");
const orders_repository_1 = require("./repositories/orders.repository");
const place_cash_order_use_case_1 = require("./use-cases/place-cash-order.use-case");
const stripe_module_1 = require("../stripe/stripe.module");
const products_module_1 = require("../products/products.module");
const confirm_stripe_order_use_case_1 = require("./use-cases/confirm-stripe-order.use-case");
const initiate_stripe_order_use_case_1 = require("./use-cases/initiate-stripe-order.use-case");
const cancel_stripe_order_use_case_1 = require("./use-cases/cancel-stripe-order.use-case");
const get_order_status_use_case_1 = require("./use-cases/get-order-status.use-case");
const get_user_orders_use_case_1 = require("./use-cases/get-user-orders.use-case");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [products_module_1.ProductsModule, stripe_module_1.StripeModule],
        controllers: [orders_controller_1.OrdersController],
        providers: [
            orders_repository_1.OrdersRepository,
            place_cash_order_use_case_1.PlaceCashOrderUseCase,
            initiate_stripe_order_use_case_1.InitiateStripeOrderUseCase,
            confirm_stripe_order_use_case_1.ConfirmStripeOrderUseCase,
            cancel_stripe_order_use_case_1.CancelStripeOrderUseCase,
            get_order_status_use_case_1.GetOrderStatusUseCase,
            get_user_orders_use_case_1.GetUserOrdersUseCase,
        ],
        exports: [orders_repository_1.OrdersRepository],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map