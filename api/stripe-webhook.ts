import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16' as any,
});

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const config = {
    api: {
        bodyParser: false,
    },
};

async function buffer(readable: any) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            buf,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const tierId = session.metadata?.tier_id || session.metadata?.tierId;
                const stripeSubscriptionId = session.subscription as string;

                if (userId && tierId) {
                    // Update subscription in Supabase
                    const { error } = await supabaseAdmin
                        .from('user_subscriptions')
                        .upsert({
                            user_id: userId,
                            tier_id: tierId,
                            status: 'active',
                            stripe_subscription_id: stripeSubscriptionId,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'user_id' });

                    if (error) throw error;
                    console.log(`Subscription activated for user ${userId}: ${tierId}`);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const stripeSubscriptionId = subscription.id;

                const { error } = await supabaseAdmin
                    .from('user_subscriptions')
                    .update({ status: 'expired', updated_at: new Date().toISOString() })
                    .eq('stripe_subscription_id', stripeSubscriptionId);

                if (error) throw error;
                console.log(`Subscription deleted: ${stripeSubscriptionId}`);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                // Logic to update expires_at or status if needed
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return res.status(200).json({ received: true });
    } catch (err: any) {
        console.error(`Supabase Sync Error: ${err.message}`);
        return res.status(500).json({ error: 'Failed to sync with database' });
    }
}
