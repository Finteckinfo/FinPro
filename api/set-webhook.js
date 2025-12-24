import TelegramBot from 'node-telegram-bot-api';

export default async function handler(req, res) {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

    try {
        const webhookUrl = `${process.env.TELEGRAM_WEBHOOK_URL}/api/telegram-webhook`;
        await bot.setWebHook(webhookUrl);

        const webhookInfo = await bot.getWebHookInfo();

        res.status(200).json({
            success: true,
            message: 'Webhook set successfully',
            webhookInfo
        });
    } catch (error) {
        console.error('Error setting webhook:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Unknown error'
        });
    }
}
