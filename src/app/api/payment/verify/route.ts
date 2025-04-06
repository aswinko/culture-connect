import { createPayment } from "@/app/actions/payment-actions";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, eventId, userId, advance_amount } = body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET!;

    const generatedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = generatedSignature === razorpay_signature;

    if (isAuthentic) {
      // ✅ Save payment to DB
      const { data, error } = await createPayment({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
        status: "success",
        booking_id: bookingId,
        event_id: eventId,
        user_id: userId,
        advance_amount: advance_amount,
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false }), { status: 400 });
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
