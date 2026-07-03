import React from 'react';
import RevenueChart from './RevenueChart';
import { getMetrics } from '@/supabase/dashboard/getMetrics';

export default async function RevenueChartWrapper() {
  const metrics = await getMetrics();
  return <RevenueChart initialMetrics={metrics} />;
}
