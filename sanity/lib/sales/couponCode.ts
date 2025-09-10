export const COUPON_CODES = {
  WSALE: 'WSALE',
  SSHORT: 'SSHORT',
  WINTERSSALE: 'WINTERSSALE',
  BLACKFRIDAY: 'BLACKFRIDAY',
  NEWYEAR: 'NEWYEAR',
} as const;

export type CouponCode = keyof typeof COUPON_CODES;
