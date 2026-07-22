#!/bin/bash
# BUDI Development Setup Script
# Run this after cloning the repository to initialize your environment.

set -e

echo "🚀 Setting up BUDI development environment..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 20.0.0"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi
echo "✅ pnpm $(pnpm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup environment
if [ ! -f .env ]; then
    echo "🔧 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your Supabase credentials"
else
    echo "✅ .env already exists"
fi

echo ""
echo "🎉 BUDI development environment is ready!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your Supabase credentials"
echo "  2. Run 'pnpm dev' to start development server"
echo "  3. Visit http://localhost:5173"
echo ""

