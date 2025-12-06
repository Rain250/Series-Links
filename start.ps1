# Series Event Layer - Startup Script
Write-Host "🚀 Starting Series Event Layer..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running! Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker is running" -ForegroundColor Green
Write-Host ""

# Build and start services
Write-Host "📦 Building and starting all services..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes on first run..." -ForegroundColor Gray
Write-Host ""

docker compose up --build

