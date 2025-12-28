import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';

// Initialize bot (without polling for serverless)
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: false });

// Initialize Supabase
const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

import { handleSupabaseWebhook as sharedHandleSupabaseWebhook } from '../telegram-bot/handlers/webhooks';

export default async function handler(req: any, res: any) {
    console.log('Webhook received:', JSON.stringify(req.body, null, 2));

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload = req.body;

        // 1. Detect if this is a Supabase Webhook
        if (payload.record && payload.table && payload.type) {
            console.log('Supabase Webhook detected:', payload.table, payload.type);
            await sharedHandleSupabaseWebhook(bot, supabase, payload);
            return res.status(200).json({ ok: true });
        }

        // 2. Handle Telegram Bot Updates
        if (payload.message) {
            const message = payload.message;

            // Handle commands
            if (message.text && message.text.startsWith('/')) {
                const command = message.text.split(' ')[0].substring(1);
                console.log('Command received:', command);

                switch (command) {
                    case 'start':
                        await bot.sendMessage(message.chat.id, 'Welcome to FinPro.\n\nFinPro allows you to manage decentralized project funding and tracking. Use the commands below to interact with your projects:\n\n/projects - List all projects associated with your linked wallet.\n/help - View detailed command instructions.');
                        break;
                    case 'projects':
                        await handleProjectsCommand(message);
                        break;
                    case 'help':
                        await bot.sendMessage(message.chat.id, 'FinPro Bot Commands:\n\n/start - Initialize the bot and view the welcome message.\n/projects - Retrieve a list of projects linked to your wallet address. Requires your Telegram account to be linked via the Mini App.\n/help - Display this help message with usage instructions.');
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

async function handleProjectsCommand(message: any) {
    try {
        // 1. Find the wallet linked to this Telegram user
        const { data: linkedUser, error: userError } = await supabase
            .from('telegram_users')
            .select('user_id')
            .eq('telegram_id', message.from.id)
            .single();

        if (userError || !linkedUser) {
            await bot.sendMessage(message.chat.id, `Account Not Linked\n\nPlease open the Mini App to link your wallet first. This connects your Telegram account to your blockchain identity:\n${process.env.TELEGRAM_MINI_APP_URL || 'https://fin1pro.vercel.app'}`);
            return;
        }

        // 2. Fetch projects for this wallet
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('id, name, status, total_funds')
            .eq('owner_id', linkedUser.user_id)
            .order('created_at', { ascending: false })
            .limit(5);

        if (projectsError) {
            console.error('Error fetching projects:', projectsError);
            await bot.sendMessage(message.chat.id, 'Error fetching projects. Please try again later.');
            return;
        }

        if (!projects || projects.length === 0) {
            await bot.sendMessage(message.chat.id, 'You have no active projects associated with your wallet.');
            return;
        }

        // 3. Format Response
        let response = '*Your Recent Projects:*\n\n';
        projects.forEach(p => {
            const statusText = p.status === 'completed' ? '[Done]' : p.status === 'active' ? '[Active]' : '[Pending]';
            response += `${statusText} *${p.name}*\nFunds: $${p.total_funds.toLocaleString()}\nID: \`${p.id}\`\n\n`;
        });

        await bot.sendMessage(message.chat.id, response, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[{
                    text: 'Open Full App',
                    web_app: { url: process.env.TELEGRAM_MINI_APP_URL || '' }
                }]]
            }
        });

    } catch (err) {
        console.error('Projects command error:', err);
        await bot.sendMessage(message.chat.id, 'An unexpected error occurred processing your request.');
    }
}
