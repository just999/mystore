const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

export const paypal = {
  createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: 'POST',

      headers: {
        Content_Type: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: price,
            },
          },
        ],
      }),
    });

    return handleResponse(response);
  },

  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
      method: 'POST',

      headers: {
        Content_Type: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse(response);
  },
};

async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

  if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
    throw new Error('PayPal credentials not found in environment variables');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    'base64'
  );

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      Content_Type: 'application/x-www-form-urlencoded',
    },
  });
  const jsonData = await handleResponse(response);
  return jsonData.access_token;

  // if (response.ok) {
  //   const jsonData = await response.json();
  //   return jsonData.access_token;
  // } else {
  //   const errorMessage = await response.text();
  //   throw new Error(errorMessage);
  // }
}

async function handleResponse(res: Response) {
  if (res.ok) {
    return res.json();
  } else {
    const errorMessage = await res.text();
    throw new Error(errorMessage);
  }
}

export { generateAccessToken };
