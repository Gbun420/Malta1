#!/bin/bash

# PM2 Setup Script
# This script sets up PM2 for local Node.js process management

echo "Setting up PM2 for local process management..."

# Install PM2 globally
echo "Installing PM2 globally..."
npm install -g pm2

# Compile TypeScript to JavaScript
echo "Compiling TypeScript to JavaScript..."
npx tsc

# Start application with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
echo "Saving PM2 configuration..."
pm2 save

echo "PM2 setup complete!"
echo "Useful PM2 commands:"
echo "pm2 status     - View application status"
echo "pm2 logs       - View application logs"
echo "pm2 restart    - Restart applications"
echo "pm2 reload     - Zero-downtime reload"
echo "pm2 monit      - Monitor applications"
echo "pm2 stop all   - Stop all applications"
echo "pm2 delete     - Remove applications from PM2"
echo ""
echo "To setup PM2 to start on system boot, run:"
echo "pm2 startup"