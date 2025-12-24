import TelegramBot from 'node-telegram-bot-api';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Handle regular text messages
 * Routes messages between admin and assignees
 */
export async function handleMessage(
    bot: TelegramBot,
    message: TelegramBot.Message,
    supabase: SupabaseClient
) {
    const chatId = message.chat.id;
    const telegramId = message.from?.id;
    const text = message.text || '';

    if (!telegramId) {
        return;
    }

    try {
        // Get user from telegram_users
        const { data: telegramUser } = await supabase
            .from('telegram_users')
            .select('user_id, role')
            .eq('telegram_id', telegramId)
            .single();

        if (!telegramUser) {
            await bot.sendMessage(
                chatId,
                'Your account is not linked. Please use /start to get started.'
            );
            return;
        }

        // For now, just acknowledge the message
        // In a full implementation, this would handle message routing
        await bot.sendMessage(
            chatId,
            'Message received! For full messaging features, please use the app.',
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Open Messaging',
                                web_app: { url: process.env.TELEGRAM_MINI_APP_URL || '' }
                            }
                        ]
                    ]
                }
            }
        );
    } catch (error) {
        console.error('Error handling message:', error);
    }
}
