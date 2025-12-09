import { getSpeedySenderDetails } from '@/sanity/lib/fetch/ekontData';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await getSpeedySenderDetails();

  return NextResponse.json(data);
}
