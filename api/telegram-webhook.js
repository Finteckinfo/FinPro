import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';

// Initialize bot (without polling for serverless)
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Initialize Supabase
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
    console.log('Webhook received:', JSON.stringify(req.body, null, 2));

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const update = req.body;
        console.log('Processing update:', update);

        // Handle different types of updates
        if (update.message) {
            const message = update.message;

            // Handle commands
            if (message.text && message.text.startsWith('/')) {
                const command = message.text.split(' ')[0].substring(1);
                console.log('Command received:', command);

                switch (command) {
                    case 'start':
                        await bot.sendMessage(message.chat.id, 'Welcome to FinPro! 🚀\n\nUse /projects to view your projects or /help for more commands.');
                        break;
                    case 'help':
                        await bot.sendMessage(message.chat.id, 'Available commands:\n/start - Welcome message\n/projects - View projects\n/help - Show this help');
                        break;
                    default:
                        await bot.sendMessage(message.chat.id, 'Unknown command. Use /help to see available commands.');
                }
            }
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
