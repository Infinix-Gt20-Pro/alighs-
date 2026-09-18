import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbUpdateOrderStatus } from '@/lib/githubDb';

const FALLBACK_KEY_SECRET = 'jQhbeYJhgZ7xWB7Fz4EDI1cE';

export async function POST(request: Request) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET || FALLBACK_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay secret key not configured on server' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const razorpay_order_id = body.razorpay_order_id || body.order_id;
    const razorpay_payment_id = body.razorpay_payment_id || body.payment_id;
    const razorpay_signature = body.razorpay_signature || body.signature;
    const storeOrderId = body.storeOrderId || body.store_order_id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
        },
        { status: 400 }
      );
    }

    // Step 3 Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedPayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(expectedPayload)
      .digest('hex');

    const isMatch =
      generatedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature, 'utf-8'),
        Buffer.from(razorpay_signature, 'utf-8')
      );

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification failed: Signature mismatch',
        },
        { status: 400 }
      );
    }

    // Signatures match - update order if storeOrderId passed
    if (storeOrderId) {
      dbUpdateOrderStatus(storeOrderId, 'confirmed', 'paid').catch((err) =>
        console.warn('DB payment status update notice:', err)
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Razorpay verify-payment error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error during verification';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
