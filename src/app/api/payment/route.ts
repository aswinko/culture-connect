import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, bookingId } = await req.json();

    const shortReceiptId = crypto
      .createHash("md5")
      .update(bookingId)
      .digest("hex")
      .slice(0, 12); // or any safe length under 40

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${shortReceiptId}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);    

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response("Error creating order", { status: 500 });
  }
}
