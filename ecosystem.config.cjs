module.exports = {
    apps: [
        {
            name: 'finpro-bot',
            script: 'npx',
            args: 'tsx telegram-bot/bot.ts',
            cwd: './',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
                TELEGRAM_USE_POLLING: 'true'
            },
            watch: false,
            max_memory_restart: '500M',
            error_file: './logs/bot-error.log',
            out_file: './logs/bot-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            autorestart: true,
            restart_delay: 4000
        }
    ]
};
