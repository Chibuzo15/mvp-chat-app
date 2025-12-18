#!/bin/bash

# Development setup script
# This script sets up the entire development environment

set -e

echo "🚀 Setting up MVP Chat App development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  echo "⚠️  Please update .env with your JWT_SECRET!"
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL + Redis)..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U chat_user -d mvp_chat > /dev/null 2>&1; do
  sleep 1
done

echo "✅ PostgreSQL is ready!"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing npm dependencies..."
  npm install
fi

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npx prisma migrate dev

# Generate Prisma Client
echo "⚙️  Generating Prisma Client..."
npx prisma generate

echo ""
echo "✨ Development environment is ready!"
echo ""
echo "To start the app, run:"
echo "  npm run dev"
echo ""
echo "To view the database, run:"
echo "  npx prisma studio"
echo ""
echo "To stop Docker services, run:"
echo "  docker-compose down"
echo ""

