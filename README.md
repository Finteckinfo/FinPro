# FinPro

FinPro is a decentralized project management and decentralized finance (DeFi) platform. It integrates blockchain technology for secure funding, task tracking, and token management. The system consists of a React-based web application, a companion Telegram bot, and a suite of smart contracts.

## Architecture and Components

The project is structured into three main layers:

### 1. Web Application (React)
- Located in `src/react-app`.
- Built with React, Vite, and TypeScript.
- Uses Ethers.js for EVM-compatible wallet integration.
- Implements real-time synchronization with Supabase via Postgres listeners.
- Features include project creation, subtask management, and token swapping.

### 2. Telegram Integration
- **Telegram Bot**: Located in `telegram-bot`. A Node.js service using `node-telegram-bot-api`.
- **Mini App**: Integrated directly into the Telegram interface for seamless wallet linking.
- **Webhook Handler**: Located in `api/telegram-webhook.ts`, deployed as a serverless function to handle both Telegram commands and database change notifications.

### 3. Smart Contracts
- Located in `contracts`.
- Developed using Hardhat and Solidity (v0.8.20+).
- Core contracts:
    - `FINToken.sol`: The platform's native ERC20 token.
    - `ProjectEscrow.sol`: Handles fund holding and release based on task completion.
    - `FINSwap.sol`: Decentralized exchange logic for platform tokens.
    - `MultiSigWallet.sol`: Secure management for administrative operations.

## Features

- **Wallet-Only Authentication**: Secure access using blockchain identity.
- **Project Governance**: Create projects with defined capital reserves and timelines.
- **Task Assignment**: Break down projects into subtasks with specific allocations.
- **Real-time Notifications**: Instant updates via Telegram when projects are created or tasks are assigned.
- **Integrated DeFi**: Token faucet and swap functionality for ecosystem testing.

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- Supabase account and project
- Telegram Bot Token (from BotFather)

### Local Configuration
1. Clone the repository and install dependencies:
    ```bash
    npm install
    ```
2. Set up environment variables:
    Create a `.env` file in the root directory. Refer to `.env.example` for the required keys.
    Important: Do not prefix sensitive service keys with VITE_ to prevent exposure to the client.

3. Start the development server:
    ```bash
    npm run dev
    ```

### Telegram Bot Setup
The bot requires a valid Vercel deployment URL for webhook registration. Use the following command to set the webhook:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=<YOUR_DEPLOYMENT_URL>/api/telegram-webhook"
```

## Security and Verification

The project includes built-in security auditing tools:
- **Slither**: For static analysis of smart contracts.
- **npm audit**: For dependency vulnerability checks.

Before deployment, it is recommended to run the build command to verify configuration:
```bash
npm run build
```

## License
All rights reserved. Private Property of Finteckinfo/FinPro.
