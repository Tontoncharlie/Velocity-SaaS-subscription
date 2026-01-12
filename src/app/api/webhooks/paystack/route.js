import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const hash = crypto
        .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(body)
        .digest('hex');

    if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle the event
    switch (event.event) {
        case 'charge.success':
            const data = event.data;
            console.log('Payment successful for:', data.customer.email, 'Reference:', data.reference);

            // Determine plan based on amount
            const amount = data.amount; // in kobo
            let plan = 'Pro';
            if (amount >= 990000) { // 9,900 NGN
                plan = 'Enterprise';
            }

            // Create Supabase Admin Client for server-side updates
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            );

            // Update user subscription status in Supabase database
            const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({ plan: plan, status: 'Active' })
                .eq('email', data.customer.email);

            if (updateError) {
                console.error('Failed to update profile subscription:', updateError);
            } else {
                console.log(`Profile subscription updated to ${plan} for:`, data.customer.email);
            }
            break;
        default:
            console.log(`Unhandled event type ${event.event}`);
    }

    return NextResponse.json({ received: true });
}
