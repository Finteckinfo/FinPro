import React from 'react';
import ReactDOM from 'react-dom/client';
import TelegramApp from './TelegramApp';
import '@/react-app/index.css';

// Initialize Telegram Mini App
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TelegramApp />
    </React.StrictMode>
);
