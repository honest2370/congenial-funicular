import { NextRequest, NextResponse } from 'next/server';

const ASHTECHPAY_BASE = process.env.ASHTECHPAY_BASE_URL || 'https://ashtechpay.top';
const ASHTECHPAY_KEY = process.env.ASHTECHPAY_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, phone, operator, country_code, reference, otp, notify_url, buyer_email, buyer_name, product_id, seller_id } = body;

    if (!amount || !currency || !phone || !operator || !country_code) {
      return NextResponse.json({ error: 'Missing required fields: amount, currency, phone, operator, country_code' }, { status: 400 });
    }

    // Call Ashtechpay API
    const payload: Record<string, string | number> = {
      amount: Number(amount),
      currency,
      phone,
      operator,
      country_code,
    };

    if (reference) payload.reference = reference;
    if (otp) payload.otp = otp;
    if (notify_url) payload.notify_url = notify_url;

    const response = await fetch(`${ASHTECHPAY_BASE}/v1/collect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ASHTECHPAY_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.status === 202) {
      // Payment initiated successfully (USSD Push or Wave)
      return NextResponse.json({
        success: true,
        transaction_id: data.transaction_id,
        reference: data.reference,
        status: data.status,
        amount: data.amount,
        credited_amount: data.credited_amount,
        fee_amount: data.fee_amount,
        currency: data.currency,
        operator: data.operator,
        flow: data.flow || 'ussd_push',
        wave_url: data.wave_url || null,
      });
    }

    if (response.status === 400 && data.error === 'otp_required') {
      // OTP required
      return NextResponse.json({
        success: false,
        requires_otp: true,
        error: 'otp_required',
        message: data.message,
        ussd_code: data.ussd_code || null,
      }, { status: 400 });
    }

    // Other errors
    return NextResponse.json({
      success: false,
      error: data.error || 'payment_failed',
      message: data.message || 'Payment initiation failed',
    }, { status: response.status });

  } catch (error) {
    return NextResponse.json({ error: 'internal_error', message: 'Internal server error' }, { status: 500 });
  }
}
