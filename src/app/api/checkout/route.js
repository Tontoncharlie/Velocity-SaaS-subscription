import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, amount } = await req.json(); // Amount in Kobo (e.g., 2900 NGN * 100)

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: amount * 100, // Convert to kobo
                callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify`,
            }),
        });

        const data = await response.json();

        if (!data.status) {
            return NextResponse.json({ error: data.message }, { status: 400 });
        }

        return NextResponse.json({ url: data.data.authorization_url });
    } catch (error) {
        console.error('Paystack error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
