import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/aws-email';
import prisma from '@/lib/prismaClient';
import { calculateLabel } from '@/actions/ekont/calculateLabel';
import { backendClient } from '@/sanity/lib/backendClient';
import { createClient } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const signature = headersList.get('sanity-webhook-signature');
  const rawBody = await req.text();

  if (!signature) {
    return NextResponse.json(
      { message: 'No signature found' },
      { status: 403 },
    );
  }

  try {
    const body = JSON.parse(rawBody);

    console.log('===Sanity Webhook Received===', body);
    const { _id, name, sku, price } = body;

    const supabase = await createClient();

    await supabase.from('products').upsert(
      {
        sanity_id: _id,
        sku: sku,
        price: price,
      },
      {
        onConflict: 'sku',
        ignoreDuplicates: false,
      },
    );

    return NextResponse.json(
      { success: true },
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.log('Error verifying Sanity signature', error);
    return NextResponse.json(
      { error: 'Error verifying Sanity signature' },
      { status: 500 },
    );
  }
}
