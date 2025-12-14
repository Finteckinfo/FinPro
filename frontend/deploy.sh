#!/bin/bash
# One-command deployment script for FinERP

set -e  # Exit on error

echo "FinERP Deployment Script"
echo "======================================"

# Detect deployment target
if [ "$1" == "vercel" ]; then
  echo "Deploying to Vercel..."
  npm run build
  vercel --prod
  
elif [ "$1" == "netlify" ]; then
  echo "Deploying to Netlify..."
  npm run build
  netlify deploy --prod --dir=dist
  
elif [ "$1" == "build" ]; then
  echo "Building for production..."
  npm run build
  echo "Build complete! Files are in ./dist/"
  echo "Upload the 'dist' folder to your web server"
  
elif [ "$1" == "dev" ]; then
  echo "Starting development server..."
  npm run dev
  
else
  echo "Usage:"
  echo "  ./deploy.sh dev       - Start development server"
  echo "  ./deploy.sh build     - Build for production"
  echo "  ./deploy.sh vercel    - Deploy to Vercel"
  echo "  ./deploy.sh netlify   - Deploy to Netlify"
  echo ""
  echo "First time setup:"
  echo "  1. cd frontend"
  echo "  2. npm ci --legacy-peer-deps"
  echo "  3. cp .env.example .env (and fill in values)"
  echo "  4. chmod +x deploy.sh"
  echo "  5. ./deploy.sh dev"
fi

