import { X, Check, Sparkles, CreditCard, Shield, Zap } from 'lucide-react';
import { useSubscription, SubscriptionTier } from '@/react-app/context/SubscriptionContext';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TIERS: SubscriptionTier[] = [
    {
        id: 'free',
        name: 'Free',
        price_monthly: 0,
        max_projects: 3,
        features: {
            analytics: false,
            support: 'Community',
            branding: false
        }
    },
    {
        id: 'pro',
        name: 'Pro',
        price_monthly: 35,
        max_projects: null,
        features: {
            analytics: true,
            support: 'Priority',
            branding: 'Custom',
            priority_queue: true
        }
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price_monthly: 350,
        max_projects: null,
        features: {
            analytics: true,
            support: 'Dedicated',
            branding: 'White-label',
            api_access: true,
            white_label: true
        }
    }
];

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
    const { subscription } = useSubscription();

    if (!isOpen) return null;

    const handleUpgrade = async (tierId: string) => {
        if (!subscription || !subscription.tier_id) return;

        try {
            const response = await fetch('/api/stripe-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tierId,
                    userId: subscription.user_id || (window as any).ethereum?.selectedAddress, // Fallback if user_id unknown
                    successUrl: window.location.origin + '/?subscription=success',
                    cancelUrl: window.location.origin + '/?subscription=cancel',
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error: any) {
            console.error('Checkout Error:', error);
            window.alert('Checkout Error: ' + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4 overflow-y-auto">
            <div className="bg-[#050B18] border border-white/10 rounded-[48px] shadow-2xl max-w-6xl w-full p-8 sm:p-12 relative my-auto">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex justify-between items-start mb-12 relative z-10">
                    <div>
                        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">Scale Your Operation</h2>
                        <p className="text-gray-400 font-bold text-lg">Choose a tier designed for your project complexity</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-white/5"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {TIERS.map((tier) => {
                        const isCurrent = subscription?.tier_id === tier.id;
                        const isPro = tier.id === 'pro';
                        const isEnterprise = tier.id === 'enterprise';

                        return (
                            <div
                                key={tier.id}
                                className={`flex flex-col p-8 rounded-[40px] border transition-all ${isCurrent
                                    ? 'bg-blue-500/10 border-blue-500/30'
                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                    } relative overflow-hidden group`}
                            >
                                {isPro && (
                                    <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-3 rounded-2xl ${isEnterprise ? 'bg-indigo-500/10 text-indigo-400' :
                                            isPro ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'
                                            }`}>
                                            {isEnterprise ? <Shield className="w-6 h-6" /> :
                                                isPro ? <Zap className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                                        </div>
                                        <h3 className="text-2xl font-black text-white">{tier.name}</h3>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-white">${tier.price_monthly}</span>
                                        <span className="text-gray-500 font-bold">/mo</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10 flex-1">
                                    <div className="flex items-center gap-3 text-white font-bold text-sm">
                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span>{tier.max_projects ? `${tier.max_projects} Active Projects` : 'Unlimited Projects'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white font-bold text-sm">
                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span>{tier.features.support} Support</span>
                                    </div>
                                    {tier.features.analytics && (
                                        <div className="flex items-center gap-3 text-white font-bold text-sm">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span>Advanced Hashrate Analytics</span>
                                        </div>
                                    )}
                                    {tier.features.branding && (
                                        <div className="flex items-center gap-3 text-white font-bold text-sm">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span>{tier.features.branding} Branding</span>
                                        </div>
                                    )}
                                    {tier.features.api_access && (
                                        <div className="flex items-center gap-3 text-white font-bold text-sm">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span>Full programmatic API access</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleUpgrade(tier.id)}
                                    disabled={isCurrent || tier.id === 'free'}
                                    className={`w-full py-5 rounded-[24px] font-black text-lg transition-all border ${isCurrent
                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/20 cursor-default'
                                        : tier.id === 'free'
                                            ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-default'
                                            : 'bg-gradient-to-r from-[#0D99FF] to-[#0066FF] text-white border-white/10 hover:shadow-[0_12px_40px_rgba(13,153,255,0.4)] hover:scale-[1.02]'
                                        }`}
                                >
                                    {isCurrent ? 'Current Plan' : tier.id === 'free' ? 'Standard' : 'Choose Plan'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-gray-500 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Grade Security</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Secure Payments via Stripe</span>
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Prices in USD. Standard local taxes may apply.</p>
                </div>
            </div>
        </div>
    );
}
