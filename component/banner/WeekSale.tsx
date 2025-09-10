import { COUPON_CODES } from '@/sanity/lib/sales/couponCode';
import { getWeekSaleByCouponCode } from '@/sanity/lib/sales/getWeekSaleByCouponCode';
import React from 'react';
import './styles.css';

export const WeekSale = async () => {
  const weekSale = await getWeekSaleByCouponCode(COUPON_CODES.WSALE);

  if (!weekSale?.isActive) return null;

  return (
    <div className=" bg-gradient-to-r from-slate-500 to-gray-300/80 rounded-sm font-semibold text-sm shadow-md px-6 py-10 my-4 flex flex-col sm:flex-row  gap-4 sm:gap-10">
      <div className="space-y-2">
        <h3 className="text-slate-100 text-2xl tracking-wider">
          {weekSale?.title}
        </h3>
        <p className="text-slate-100 text-sm tracking-wider">
          {weekSale?.description}
        </p>
      </div>
      <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full w-fit">
        <p className="text-lime-700 text-sm tracking-wider ">
          {weekSale?.couponCode}
        </p>
        <p className="text-slate-800 text-sm tracking-wider">
          {weekSale?.discountAmount}% OFF
        </p>
      </div>
    </div>
  );
};
