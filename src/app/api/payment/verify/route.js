import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
    try {
        const { reference, userId } = await req.json();

        if (!reference) {
            return NextResponse.json({ error: 'No reference provided' }, { status: 400 });
        }

        // Verify transaction with Paystack
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const verifyData = await verifyRes.json();

        if (!verifyData.status || verifyData.data.status !== 'success') {
            return NextResponse.json({ error: 'Transaction failed or invalid' }, { status: 400 });
        }

        const email = verifyData.data.customer.email;
        const amount = verifyData.data.amount; // in kobo

        // Determine plan based on amount (amount is in kobo)
        let plan = 'Pro';
        if (amount >= 900000) { // 9,900 NGN
            plan = 'Enterprise';
        }

        // Create Supabase Admin Client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        console.log(`[Verify] Processing for ${email} (User ID: ${userId || 'N/A'}) -> Plan: ${plan}`);

        const updates = {
            plan: plan,
            status: 'Active',
            // updated_at: new Date().toISOString() // Removed due to schema missing column
        };

        if (userId) {
            // Robust UPSERT using User ID
            const { data, error, count } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: userId,
                    email: email,
                    ...updates
                })
                .select();

            if (error) {
                console.error('[Verify] Upsert error:', error);
                return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
            }
            console.log('[Verify] Upsert success:', count);
            return NextResponse.json({ success: true, plan, count });
        } else {
            // Fallback UPDATE by email
            const { data, error, count } = await supabaseAdmin
                .from('profiles')
                .update(updates)
                .eq('email', email)
                .select();

            if (error) {
                console.error('[Verify] Update error:', error);
                return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
            }
            console.log('[Verify] Update success:', count);
            return NextResponse.json({ success: true, plan, count });
        }
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
