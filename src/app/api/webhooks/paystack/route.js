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
        case 'charge.success':
    const data = event.data;
    console.log('Payment successful for:', data.customer.email, 'Reference:', data.reference);

    // Create Supabase Admin Client for server-side updates
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Update user subscription status in Supabase database
    // We assume the email in Paystack matches the user's email
    // First find the user ID by email if needed, or update by email if email is unique in profiles
    const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ plan: 'Pro', status: 'Active' })
        .eq('email', data.customer.email);

    if (updateError) {
        console.error('Failed to update profile subscription:', updateError);
    } else {
        console.log('Profile subscription updated to Pro for:', data.customer.email);
    }
    break;
        default:
    console.log(`Unhandled event type ${event.event}`);
}

return NextResponse.json({ received: true });
}
