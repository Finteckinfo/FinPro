export const APP_CONFIG = {
    // The base URL for the application, used for redirects and social links
    // In Vercel, this can be set to the production domain
    appUrl: import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'),

    // Supabase Configuration
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },

    // App Metadata
    name: 'FinPro',
    description: 'Decentralized Project Management with Blockchain Escrow',
};
