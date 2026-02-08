#!/bin/bash

# Seconde Main - Startup Script
# This script helps you start the application with Docker Compose

echo "=========================================="
echo "Seconde Main - Second-Hand Product Search"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not available"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are available"
echo ""

# Start the services
echo "🚀 Starting all services with Docker Compose..."
echo "This may take a few minutes on the first run..."
echo ""

docker compose up --build -d

# Check if services started successfully
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All services started successfully!"
    echo ""
    echo "📝 Service URLs:"
    echo "   Frontend:         http://localhost:3000"
    echo "   API Gateway:      http://localhost:4000"
    echo "   User Service:     http://localhost:4001"
    echo "   Search Service:   http://localhost:4002"
    echo "   Scraper Service:  http://localhost:4003"
    echo ""
    echo "⏳ Waiting for services to be ready (30 seconds)..."
    sleep 30
    echo ""
    echo "📦 Populating database with sample products..."
    curl -X POST http://localhost:4000/api/scraper/run 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Database populated with sample products!"
    else
        echo ""
        echo "⚠️  Could not populate database automatically."
        echo "   You can do it manually with:"
        echo "   curl -X POST http://localhost:4000/api/scraper/run"
    fi
    
    echo ""
    echo "🎉 Application is ready!"
    echo "   Open http://localhost:3000 in your browser"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:        docker compose logs -f"
    echo "   Stop services:    docker compose down"
    echo "   Restart services: docker compose restart"
    echo ""
else
    echo ""
    echo "❌ Failed to start services"
    echo "Run 'docker compose logs' to see error details"
    exit 1
fi
