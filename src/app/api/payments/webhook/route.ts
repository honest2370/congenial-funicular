import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, transaction_id, reference, status, amount, total_amount, currency, phone, timestamp } = body;

    // Always respond 200 immediately
    if (event === 'payment.completed') {
      // Find order by reference or transaction_id
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('payment_ref', reference || '')
        .single();

      if (order) {
        // Update order status
        await supabaseAdmin
          .from('orders')
          .update({
            status: 'success',
            ashtechpay_txn_id: transaction_id,
            confirmed_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        // Update product sales count
        await supabaseAdmin.rpc('increment_product_sales', { product_id: order.product_id });

        // Create notification for seller
        await supabaseAdmin.from('notifications').insert({
          user_id: order.seller_id,
          type: 'payment',
          title: 'Payment Confirmed',
          message: `Payment of ${amount} ${currency} confirmed for order ${reference}`,
          read: false,
        });

        // Grant product access to buyer
        await supabaseAdmin.from('product_access').insert({
          buyer_email: order.buyer_email,
          product_id: order.product_id,
          order_id: order.id,
        });
      }
    }

    if (event === 'payment.failed') {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('payment_ref', reference || '')
        .single();

      if (order) {
        await supabaseAdmin
          .from('orders')
          .update({ status: 'failed' })
          .eq('id', order.id);

        await supabaseAdmin.from('notifications').insert({
          user_id: order.seller_id,
          type: 'payment',
          title: 'Payment Failed',
          message: `Payment of ${amount} ${currency} failed for order ${reference}`,
          read: false,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ received: true });
  }
}
