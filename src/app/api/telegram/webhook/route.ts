import { NextRequest, NextResponse } from 'next/server';
import { answerPreCheckoutQuery } from '@/lib/telegram';
import { connectToDatabase } from '@/lib/mongodb';
import crypto from 'crypto';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

function verifySecretToken(request: NextRequest): boolean {
  if (!TELEGRAM_WEBHOOK_SECRET) return true;
  const token = request.headers.get('x-telegram-bot-api-secret-token');
  return token === TELEGRAM_WEBHOOK_SECRET;
}

export async function POST(request: NextRequest) {
  try {
    if (!verifySecretToken(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (body.pre_checkout_query) {
      const { id, from } = body.pre_checkout_query;
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({ telegramId: from.id });

      if (!user) {
        await answerPreCheckoutQuery(String(id), false, 'User not found. Please link your account first.');
        return NextResponse.json({ success: false });
      }

      await answerPreCheckoutQuery(String(id), true);
      return NextResponse.json({ success: true });
    }

    if (body.successful_payment) {
      const telegramId = body.message?.from?.id;
      const { invoice_payload } = body.successful_payment;

      if (!telegramId) {
        return NextResponse.json({ error: 'Missing user info' }, { status: 400 });
      }

      const payloadParts = invoice_payload.split('_');
      const plan = payloadParts[0] || 'pro';

      const { db } = await connectToDatabase();
      await db.collection('users').updateOne(
        { telegramId },
        {
          $set: {
            plan,
            creditsRemaining: plan === 'pro' ? 999 : 9999,
            updatedAt: new Date(),
          },
        }
      );

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramId,
          text: `Payment successful! You are now on the ${plan.toUpperCase()} plan. Enjoy unlimited resume optimizations!`,
        }),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
