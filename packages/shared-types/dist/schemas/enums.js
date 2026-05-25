"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryMethodSchema = exports.PaymentMethodSchema = exports.OrderStatusSchema = exports.PaymentMethodEnum = exports.DeliveryMethodEnum = void 0;
const zod_1 = require("zod");
var DeliveryMethodEnum;
(function (DeliveryMethodEnum) {
    DeliveryMethodEnum["SPEEDY_OFFICE"] = "speedy-office";
    DeliveryMethodEnum["SPEEDY_DELIVERY"] = "speedy-delivery";
    DeliveryMethodEnum["EKONT_OFFICE"] = "ekont-office";
    DeliveryMethodEnum["EKONT_DELIVERY"] = "ekont-delivery";
})(DeliveryMethodEnum || (exports.DeliveryMethodEnum = DeliveryMethodEnum = {}));
var PaymentMethodEnum;
(function (PaymentMethodEnum) {
    PaymentMethodEnum["CASH"] = "cash";
    PaymentMethodEnum["STRIPE"] = "stripe";
})(PaymentMethodEnum || (exports.PaymentMethodEnum = PaymentMethodEnum = {}));
exports.OrderStatusSchema = zod_1.z.enum(['pending', 'confirmed', 'shipped', 'refunded', 'cancelled']);
exports.PaymentMethodSchema = zod_1.z.nativeEnum(PaymentMethodEnum);
exports.DeliveryMethodSchema = zod_1.z.nativeEnum(DeliveryMethodEnum);
