#!/bin/bash

# Quick Start Script for the Application
# Supports local development, Docker, and PM2 deployment

set -e  # Exit on any error

echo "🚀 Quick Start Script for the Application"
echo "========================================"

# Function to show help
show_help() {
    echo "Usage: ./quick-start.sh [mode]"
    echo ""
    echo "Modes:"
    echo "  dev         - Start local development server (default)"
    echo "  docker      - Build and run with Docker"
    echo "  pm2         - Start with PM2 process manager"
    echo "  verify      - Run verification checks"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./quick-start.sh dev"
    echo "  ./quick-start.sh docker"
    echo "  ./quick-start.sh pm2"
}

# Function to start local development
start_dev() {
    echo "🔧 Starting local development server..."
    echo "   This will:"
    echo "   - Kill any process using port 3000"
    echo "   - Start the TypeScript server with hot reload"
    echo ""
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install Node.js and npm."
        exit 1
    fi
    
    if ! npm run dev; then
        echo "❌ Failed to start development server"
        exit 1
    fi
}

# Function to build and run with Docker
start_docker() {
    echo "🐳 Building and running with Docker..."
    echo "   This will:"
    echo "   - Build the Docker image with BuildKit"
    echo "   - Run the container on port 3000"
    echo "   - Load environment variables from .env"
    echo ""
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        echo "⚠️  .env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            echo "✅ Created .env file. Please update it with your configuration."
        else
            echo "❌ .env.example file not found. Cannot create .env file."
            exit 1
        fi
    fi
    
    echo "🏗️  Building Docker image..."
    if ! DOCKER_BUILDKIT=1 docker build -t app:local .; then
        echo "❌ Failed to build Docker image"
        exit 1
    fi
    
    echo "🏃 Running Docker container..."
    if ! docker run --rm -p 3000:3000 --env-file .env app:local; then
        echo "❌ Failed to run Docker container"
        exit 1
    fi
}

# Function to start with PM2
start_pm2() {
    echo "⚙️  Starting with PM2..."
    echo "   This will:"
    echo "   - Start the application using PM2"
    echo "   - Use the ecosystem.config.js configuration"
    echo ""
    
    if ! command -v pm2 &> /dev/null; then
        echo "❌ PM2 is not installed. Installing PM2..."
        if ! npm install -g pm2; then
            echo "❌ Failed to install PM2"
            exit 1
        fi
    fi
    
    echo "🏃 Starting application with PM2..."
    if ! pm2 start ecosystem.config.js; then
        echo "❌ Failed to start application with PM2"
        exit 1
    fi
    
    echo "📋 Saving PM2 configuration..."
    pm2 save
    
    echo "📝 View logs with: pm2 logs"
}

# Function to run verification
run_verification() {
    echo "✅ Running verification checks..."
    echo ""
    
    echo "🔍 Checking health endpoint..."
    if curl -fsS http://localhost:3000/health > /dev/null; then
        echo "✅ Health check passed"
    else
        echo "❌ Health check failed"
    fi
    
    echo "🔍 Checking Prisma client..."
    if node -e "require('@prisma/client'); console.log('✅ Prisma client OK')"; then
        echo "✅ Prisma client verification passed"
    else
        echo "❌ Prisma client verification failed"
    fi
}

# Main script logic
main() {
    local mode=${1:-dev}
    
    case $mode in
        dev)
            start_dev
            ;;
        docker)
            start_docker
            ;;
        pm2)
            start_pm2
            ;;
        verify)
            run_verification
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo "❌ Unknown mode: $mode"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"