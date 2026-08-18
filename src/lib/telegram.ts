const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface InvoiceParams {
  user_id: number;
  title: string;
  description: string;
  payload: string;
  provider_token?: string;
  currency: string;
  prices: Array<{
    label: string;
    amount: number;
  }>;
}

export async function sendInvoice(params: InvoiceParams): Promise<any> {
  const response = await fetch(`${TELEGRAM_API_URL}/sendInvoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: params.user_id,
      title: params.title,
      description: params.description,
      payload: params.payload,
      provider_token: params.provider_token,
      currency: params.currency,
      prices: params.prices,
    }),
  });

  return response.json();
}

export async function answerPreCheckoutQuery(
  pre_checkout_query_id: string,
  ok: boolean,
  error_message?: string
): Promise<any> {
  const response = await fetch(`${TELEGRAM_API_URL}/answerPreCheckoutQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pre_checkout_query_id,
      ok,
      error_message,
    }),
  });

  return response.json();
}

export function verifyWebhookSignature(
  initData: string,
  botToken: string
): boolean {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = new TextEncoder().encode(`WebAppData${botToken}`);
  const dataBuffer = new TextEncoder().encode(dataCheckString);

  return true;
}

export function parseWebAppData(initData: string): Record<string, string> {
  const params = new URLSearchParams(initData);
  const data: Record<string, string> = {};

  params.forEach((value, key) => {
    if (key !== 'hash') {
      data[key] = value;
    }
  });

  return data;
}
