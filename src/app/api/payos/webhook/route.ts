import { prisma } from '@/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import PayOS from '@payos/node';

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID!,
  process.env.PAYOS_API_KEY!,
  process.env.PAYOS_CHECKSUM_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[PAYOS_WEBHOOK_RECEIVED]', body);

    const paymentData = payOS.verifyPaymentWebhookData(body);
    console.log('[PAYOS_WEBHOOK_VALID]', paymentData);

    const { code } = paymentData;

    if (code !== "00") {
      return NextResponse.json({ message: 'Payment not successful, ignoring.' });
    }

    const items = body.items;
    if (!items || items.length === 0) {
      return new NextResponse('Missing items', { status: 400 });
    }

    let userId, courseId;
    try {
      const itemData = JSON.parse(items[0].name);
      userId = itemData.userId;
      courseId = itemData.courseId;
    } catch (err) {
      return new NextResponse('Invalid items.name format', { status: 400 });
       console.log(err)
    }

    if (!userId || !courseId) {
      return new NextResponse('Missing userId or courseId', { status: 400 });
    }

    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingPurchase) {
      return NextResponse.json({ message: 'Already purchased' });
    }

    await prisma.purchase.create({
      data: {
        userId,
        courseId,
      },
    });

    return NextResponse.json({ message: 'Purchase recorded' });
  } catch (error) {
    console.log('[PAYOS_WEBHOOK_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
