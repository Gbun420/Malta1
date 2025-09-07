@echo off
setlocal enabledelayedexpansion

echo 🚀 Quick Start Script for the Application
echo ========================================

REM Function to show help
:show_help
echo Usage: quick-start.bat [mode]
echo.
echo Modes:
echo   dev         - Start local development server (default)
echo   docker      - Build and run with Docker
echo   pm2         - Start with PM2 process manager
echo   verify      - Run verification checks
echo   help        - Show this help message
echo.
echo Examples:
echo   quick-start.bat dev
echo   quick-start.bat docker
echo   quick-start.bat pm2
goto :eof

REM Function to start local development
:start_dev
echo 🔧 Starting local development server...
echo    This will:
echo    - Kill any process using port 3000
echo    - Start the TypeScript server with hot reload
echo.

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install Node.js and npm.
    exit /b 1
)

echo 🏃 Starting development server...
npm run dev
if %errorlevel% neq 0 (
    echo ❌ Failed to start development server
    exit /b 1
)
goto :eof

REM Function to build and run with Docker
:start_docker
echo 🐳 Building and running with Docker...
echo    This will:
echo    - Build the Docker image with BuildKit
echo    - Run the container on port 3000
echo    - Load environment variables from .env
echo.

where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker.
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from .env.example...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo ✅ Created .env file. Please update it with your configuration.
    ) else (
        echo ❌ .env.example file not found. Cannot create .env file.
        exit /b 1
    )
)

echo 🏗️  Building Docker image...
set DOCKER_BUILDKIT=1
docker build -t app:local .
if %errorlevel% neq 0 (
    echo ❌ Failed to build Docker image
    exit /b 1
)

echo 🏃 Running Docker container...
docker run --rm -p 3000:3000 --env-file .env app:local
if %errorlevel% neq 0 (
    echo ❌ Failed to run Docker container
    exit /b 1
)
goto :eof

REM Function to start with PM2
:start_pm2
echo ⚙️  Starting with PM2...
echo    This will:
echo    - Start the application using PM2
echo    - Use the ecosystem.config.js configuration
echo.

where pm2 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PM2 is not installed. Installing PM2...
    npm install -g pm2
    if %errorlevel% neq 0 (
        echo ❌ Failed to install PM2
        exit /b 1
    )
)

echo 🏃 Starting application with PM2...
pm2 start ecosystem.config.js
if %errorlevel% neq 0 (
    echo ❌ Failed to start application with PM2
    exit /b 1
)

echo 📋 Saving PM2 configuration...
pm2 save

echo 📝 View logs with: pm2 logs
goto :eof

REM Function to run verification
:run_verification
echo ✅ Running verification checks...
echo.

echo 🔍 Checking health endpoint...
curl -fsS http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Health check passed
) else (
    echo ❌ Health check failed
)

echo 🔍 Checking Prisma client...
node -e "require('@prisma/client'); console.log('✅ Prisma client OK')" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Prisma client verification passed
) else (
    echo ❌ Prisma client verification failed
)
goto :eof

REM Main script logic
set mode=%1
if "%mode%"=="" set mode=dev

if "%mode%"=="dev" (
    call :start_dev
) else if "%mode%"=="docker" (
    call :start_docker
) else if "%mode%"=="pm2" (
    call :start_pm2
) else if "%mode%"=="verify" (
    call :run_verification
) else if "%mode%"=="help" (
    call :show_help
) else if "%mode%"=="--help" (
    call :show_help
) else if "%mode%"=="-h" (
    call :show_help
) else (
    echo ❌ Unknown mode: %mode%
    echo.
    call :show_help
    exit /b 1
)