import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/aws-email';
import prisma from '@/lib/prismaClient';
import { senderInfo } from '@/actions/ekont/senderDetails';
import { calculateLabel } from '@/actions/ekont/calculateLabel';
import { backendClient } from '@/sanity/lib/backendClient';

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

    return NextResponse.json(
      { success: true },
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.log('Error Sending Emails', error);
    return NextResponse.json(
      { error: 'Error verifying Stripe signature' },
      { status: 500 },
    );
  }
}
