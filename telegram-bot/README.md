# Telegram Bot Configuration

This directory contains the Telegram bot server that handles:
- User authentication via Telegram
- Push notifications
- Message routing between admins and assignees
- Webhook handling

## Setup

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Copy the bot token to `.env`:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_WEBHOOK_URL=https://your-domain.com/webhook
   TELEGRAM_MINI_APP_URL=https://your-mini-app-url.com
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the bot server:
   ```bash
   npm run bot:dev
   ```

## Commands

- `/start` - Initialize bot and link Telegram account
- `/projects` - View your projects
- `/help` - Show help message
