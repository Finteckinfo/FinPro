import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16' as any,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { tierId, userId, successUrl, cancelUrl } = req.body;

    if (!tierId || !userId) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Map tier IDs to Stripe Price IDs (these should be in env vars in production)
    const priceMap: Record<string, string | undefined> = {
        pro: process.env.STRIPE_PRICE_PRO,
        enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
    };

    const priceId = priceMap[tierId];

    if (!priceId) {
        return res.status(404).json({ error: 'Invalid tier ID' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            client_reference_id: userId,
            metadata: {
                userId,
                tierId,
            },
        });

        return res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Stripe Session Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
