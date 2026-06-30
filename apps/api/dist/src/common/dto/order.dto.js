"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderShippingDto = exports.OrderItemDto = exports.OrderDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const shared_types_1 = require("@repo/shared-types");
class OrderDto extends (0, nestjs_zod_1.createZodDto)(shared_types_1.OrderSchema) {
}
exports.OrderDto = OrderDto;
class OrderItemDto extends (0, nestjs_zod_1.createZodDto)(shared_types_1.OrderItemSchema) {
}
exports.OrderItemDto = OrderItemDto;
class OrderShippingDto extends (0, nestjs_zod_1.createZodDto)(shared_types_1.OrderShippingSchema) {
}
exports.OrderShippingDto = OrderShippingDto;
//# sourceMappingURL=order.dto.js.map