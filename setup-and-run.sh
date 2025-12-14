#!/bin/bash
# Setup and run FinERP frontend development server

cd /home/c0bw3b/.cursor/worktrees/FINERP/sbf/frontend

echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps || npm install --legacy-peer-deps

echo "🚀 Starting development server..."
npm run dev
