import { getEkontSenderDetails } from '@/sanity/lib/fetch/ekontData';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await getEkontSenderDetails();

  return NextResponse.json(data);
}
