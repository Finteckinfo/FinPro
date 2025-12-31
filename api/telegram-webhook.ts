import type { Request, Response } from 'express';
import { Bot } from 'grammy';

// Initialize bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || '');

// Simple inline handlers
bot.command('ping', async (ctx) => {
    await ctx.reply('pong');
});

bot.command('start', async (ctx) => {
    const firstName = ctx.from?.first_name || 'User';
    await ctx.reply(`Hello ${firstName}! Bot is working with manual processing.`);
});

bot.command('help', async (ctx) => {
    await ctx.reply('Available commands: /start, /ping, /help');
});

export default async function handler(req: Request, res: Response) {
    console.log('Function started successfully');
    
    try {
        // Simple health check
        if (req.method === 'GET') {
            return res.status(200).json({ status: 'ok', message: 'Telegram webhook is running' });
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const update = req.body;
        console.log('Received update:', update);

        // Manual processing without webhookCallback
        if (update.message && update.message.text) {
            const text = update.message.text;
            const chatId = update.message.chat.id;
            const userId = update.message.from?.id;

            console.log('Processing command:', text, 'from user:', userId);

            // Manually handle commands
            if (text === '/ping') {
                await bot.api.sendMessage(chatId, 'pong');
            } else if (text === '/start') {
                const firstName = update.message.from?.first_name || 'User';
                await bot.api.sendMessage(chatId, `Hello ${firstName}! Bot is working with manual processing.`);
            } else if (text === '/help') {
                await bot.api.sendMessage(chatId, 'Available commands: /start, /ping, /help');
            }
        }

        return res.status(200).json({ status: 'ok', message: 'Update processed' });
    } catch (error) {
        console.error('Webhook error:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
