import { NextRequest, NextResponse } from 'next/server';
import { answerPreCheckoutQuery, parseWebAppData } from '@/lib/telegram';
import { connectToDatabase } from '@/lib/mongodb';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle pre-checkout query
    if (body.pre_checkout_query) {
      const { id, from, invoice_payload } = body.pre_checkout_query;

      // Verify the user and payload
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({
        telegramId: from.id,
      });

      if (!user) {
        await answerPreCheckoutQuery(String(id), false, 'User not found');
        return NextResponse.json({ success: false });
      }

      // Accept the pre-checkout
      await answerPreCheckoutQuery(String(id), true);
      return NextResponse.json({ success: true });
    }

    // Handle successful payment
    if (body.successful_payment) {
      const { telegram_id, payment } = body.message || body;
      const { invoice_payload, total_amount, currency } = body.successful_payment;

      // Parse the payload to determine the plan
      const payloadParts = invoice_payload.split('_');
      const plan = payloadParts[0] || 'pro';

      // Update user plan in database
      const { db } = await connectToDatabase();
      await db.collection('users').updateOne(
        { telegramId: telegram_id },
        {
          $set: {
            plan,
            creditsRemaining: plan === 'pro' ? 999 : 9999,
            updatedAt: new Date(),
          },
        }
      );

      // Send confirmation message via Telegram API
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegram_id,
            text: `✅ Payment successful! You are now on the ${plan.toUpperCase()} plan. Enjoy unlimited resume optimizations!`,
          }),
        }
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
