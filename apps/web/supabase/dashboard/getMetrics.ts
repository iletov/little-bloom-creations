import { createClient } from '@/lib/supabaseServer';

export async function getMetrics() {
  const supabase = await createClient();
  // Get today's orders
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'confirmed')
    .gte('created_at', new Date().toISOString().split('T')[0]);

  const { data: allOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'confirmed');

  const todayRevenue =
    todayOrders?.reduce(
      (total, order) => total + parseFloat(order.subtotal),
      0,
    ) || 0;

  const allRevenue =
    allOrders?.reduce((total, order) => total + order.subtotal, 0) || 0;

  const todayOrdersCount = todayOrders?.length || 0;

  // Get pending orders count
  const { data: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Get products count
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { count: productVariantsCount } = await supabase
    .from('product_variants')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // // Get low stock products
  // const { count: lowStockProductsCount } = await supabase
  //   .from('products')
  //   .select('*', { count: 'exact', head: true })
  //   .eq('is_active', true)
  //   // .is('has_variants', false) // Only products without variants
  //   .lte('current_stock', 10);

  // // Get low stock variants
  // const { count: lowStockVariantsCount } = await supabase
  //   .from('product_variants')
  //   .select('*', { count: 'exact', head: true })
  //   .eq('is_active', true)
  //   .lte('current_stock', 10);

  // Combine both counts
  // const totalLowStock =
  //   (lowStockProductsCount || 0) + (lowStockVariantsCount || 0);

  const totalProductsCount = (productsCount || 0) + (productVariantsCount || 0);

  return {
    todayRevenue,
    todayOrdersCount,
    pendingOrdersCount: pendingOrders?.length || 0,
    productsCount: totalProductsCount,
    allRevenue: allRevenue.toFixed(2),
    // lowStockCount: totalLowStock,
  };
}
