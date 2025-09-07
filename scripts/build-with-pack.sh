#!/bin/bash

# Buildpacks Setup Script
# This script builds container images using Cloud Native Buildpacks

echo "Setting up Cloud Native Buildpacks..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Homebrew is required but not installed. Please install Homebrew first."
    exit 1
fi

# Install pack CLI
echo "Installing pack CLI..."
brew install buildpacks/tap/pack

# Verify installation
echo "Verifying pack installation..."
pack version

# Build the application with explicit builder
echo "Building application with Paketo Buildpacks..."
pack build my-app \
    --builder paketobuildpacks/builder-jammy-base \
    --path .

echo "Build complete! To run the image locally:"
echo "docker run -p 3000:3000 my-app"

echo "For more information on pack CLI commands, visit:"
echo "https://buildpacks.io/docs/for-platform-operators/how-to/integrate-ci/pack/cli/"