import { validateRequest } from '@/auth';
import { prisma } from '@/db/prisma';
import { NextResponse } from 'next/server';

import PayOS from '@payos/node';

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID!,
  process.env.PAYOS_API_KEY!,
  process.env.PAYOS_CHECKSUM_KEY!,
);

function generateOrderCode() {
  return Math.floor(100000 + Math.random() * 900000);
}
function truncateString(str: string): string {
  if (str.length <= 10) {
    return str;
  }
  return str.slice(0, 10) + '...';
}
// async function setupWebhook() {
//   const res = await payOS.confirmWebhook(
//     'https://599d-118-70-249-58.ngrok-free.app/api/payos/webhook',
//   );
//   console.log(res); // Nếu thành công sẽ log thông báo xác nhận
// }

// setupWebhook();
export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { user } = await validateRequest();
    const { courseId } = await params;
    if (!user || !user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse('Already purchased', { status: 400 });
    }

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    /*
			Check if user already has a record in the StripeCustomer
			table, if not which means it's first time for our user to
			purchase a course in our platform, create one with his
			first email address in the stripe and in the StripeCustomer
			table
		*/

    // Kiểm tra xem đã có PayOS customer chưa (tùy logic, có thể không cần nếu không lưu)
    let payosCustomer = await prisma.payOSCustomer.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        payosCustomerId: true,
      },
    });

    // Nếu chưa có, tạo thông tin lưu vào DB (có thể skip bước này nếu PayOS không cần lưu customer riêng)
    if (!payosCustomer) {
      const fakeCustomerId = `payos_${user.id}`;
      payosCustomer = await prisma.payOSCustomer.create({
        data: {
          userId: user.id,
          payosCustomerId: fakeCustomerId,
        },
      });
    }

    const orderCode = generateOrderCode();

    const paymentRes = await payOS.createPaymentLink({
      amount: Math.round(course.price!),
      description:
        'EduAI ' +
        course.price! +
        ' ' +
        truncateString(course.title || course.description || 'Eduai'),
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/learn/courses/${course.id}?success=1&userId=${user.id}`,
      orderCode: orderCode,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/learn/courses/${course.id}?canceled=1`,
      items: [
        {
          name: JSON.stringify({
            userId: user.id,
            courseId: course.id,
          }),
          quantity: 1,
          price: Math.round(course.price!),
        },
      ],
    });

    const paymentUrl = paymentRes.checkoutUrl;
    return NextResponse.json({ url: paymentUrl });
  } catch (error) {
    console.log('[COURSE_ID_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
