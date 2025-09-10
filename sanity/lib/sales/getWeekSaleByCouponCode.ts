import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { CouponCode } from './couponCode';

export const getWeekSaleByCouponCode = async (couponCode: CouponCode) => {
  const WEEK_SALE_QUERY = defineQuery(`
    *[_type == "salesType" && couponCode == $couponCode && isActive == true] | order(validFrom desc)[0]
    `);

  try {
    const activeSale = await sanityFetch({
      query: WEEK_SALE_QUERY,
      params: {
        couponCode, //pass the couponCode as a parameter
      },
    });

    return activeSale ? activeSale.data : null;
  } catch (error) {
    console.error('Error fetching week sale', error);
    return null;
  }
};
