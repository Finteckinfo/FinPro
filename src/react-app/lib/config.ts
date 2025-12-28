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

    // Contract Addresses (Local Anvil)
    contracts: {
        finToken: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
        projectEscrow: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
        finSwap: '0x9A676e781A523b5d0C0e43731313A708CB607508',
        multiSigWallet: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
    },
};
