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
      { status: 401 },
    );
  }

  try {
    const body = JSON.parse(rawBody);

    console.log('===Sanity Webhook Received===', body);

    const receiver = await prisma.userCheckout.findFirst({
      where: {
        orderNumber: body.orderNumber,
      },
    });

    const receiverAddress = {
      phoneNumber: receiver?.phones[0],
      city: receiver?.city,
      postalCode: receiver?.postCode,
      street: receiver?.street,
      streetNumber: receiver?.streetNumber,
      other: receiver?.other,
      officeCode: receiver?.receiverOfficeCode,
    };

    console.log('RECEIVER ADDRESS', receiverAddress);

    const [firstName, lastName] = receiver?.name?.split(' ') ?? [];

    const receiverNames = {
      firstName,
      lastName,
    };

    console.log('WEBHOOK RECEIVER', receiver);

    const sender = await senderInfo();

    const label = await calculateLabel(
      sender[0],
      receiverNames,
      receiverAddress,
      receiver?.cdAmount ?? 0,
      receiver?.receiverDeliveryType ?? '',
      receiver?.paymentMethod ?? '',
      true,
    );

    const labelUrl = label?.label?.pdfURL;

    console.log('LABEL ROOT', label);

    console.log('LABEL URL', labelUrl);

    await prisma.userCheckout.updateMany({
      where: {
        orderNumber: body.orderNumber,
      },
      data: {
        pdfURL: labelUrl,
      },
    });

    const findOrderByNumber = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber]{
        _id,
        labelURL,
        }[0]`,
      { orderNumber: body.orderNumber },
    );

    const response = await fetch(labelUrl);
    const fileBuffer = await response.arrayBuffer();

    const asset = await backendClient.assets.upload(
      'file',
      Buffer.from(fileBuffer),
      {
        filename: `label-${body.orderNumber}.pdf`, // Assuming it's a PDF
        contentType: 'application/pdf',
      },
    );

    if (!findOrderByNumber.labelURL) {
      await backendClient
        .patch(findOrderByNumber._id)
        // .setIfMissing({ labelURL: labelUrl })
        .set({
          labelURL: labelUrl,
          labelAsset: {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
        .commit();
    } else {
      console.log(`No label update needed for order: ${body.orderNumber}`);
      return new Response('No label update needed', { status: 200 });
    }

    //TODO: Add logic to send information so the user can be notified about delivery status
    // if (body.status === 'send' && labelUrl) {
    //   await sendWelcomeEmail(
    //     body.customerDetails.customerEmail,
    //     body.customerDetails.customerName,
    //     body.status,
    //   );
    // }

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
