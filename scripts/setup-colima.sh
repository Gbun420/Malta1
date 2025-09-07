#!/bin/bash

# Colima Setup Script
# This script sets up Colima as a Docker alternative on macOS

echo "Setting up Colima for Docker development..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Homebrew is required but not installed. Please install Homebrew first."
    exit 1
fi

# Install Colima
echo "Installing Colima..."
brew install colima

# Start Colima
echo "Starting Colima VM..."
colima start

# Set Docker context to Colima
echo "Setting Docker context to Colima..."
docker context use colima

# Verify setup
echo "Verifying Colima setup..."
docker info

echo "Colima setup complete! You can now use standard Docker commands."
echo "To stop Colima: colima stop"
echo "To restart Colima: colima start"
echo "If colima start fails, try: colima delete && colima start"