# Series Event Layer - Railway Deployment Script
# Quick deploy to Railway platform

Write-Host "🚀 Deploying Series Event Layer to Railway..." -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue

if (-not $railwayInstalled) {
    Write-Host "📦 Installing Railway CLI..." -ForegroundColor Yellow
    
    # Check if npm is available
    $npmInstalled = Get-Command npm -ErrorAction SilentlyContinue
    if ($npmInstalled) {
        Write-Host "   Installing via npm..." -ForegroundColor Gray
        npm i -g @railway/cli
    } else {
        Write-Host "❌ npm is not installed. Please install Node.js first." -ForegroundColor Red
        Write-Host ""
        Write-Host "Alternatively, install Railway CLI manually:" -ForegroundColor Yellow
        Write-Host "  https://docs.railway.app/develop/cli#installation" -ForegroundColor Gray
        exit 1
    }
}

Write-Host "✅ Railway CLI ready" -ForegroundColor Green
Write-Host ""

# Check if logged in
Write-Host "🔐 Checking Railway authentication..." -ForegroundColor Yellow
$railwayLogin = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Not logged in. Please login..." -ForegroundColor Gray
    railway login
}

Write-Host "✅ Authenticated" -ForegroundColor Green
Write-Host ""

# Check if project is linked
Write-Host "🔗 Checking project link..." -ForegroundColor Yellow
$projectStatus = railway status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   No project linked. Initializing..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "Choose an option:" -ForegroundColor Cyan
    Write-Host "  1. Create new Railway project"
    Write-Host "  2. Link to existing project"
    Write-Host ""
    $choice = Read-Host "Enter choice (1 or 2)"
    
    if ($choice -eq "1") {
        railway init
    } else {
        Write-Host "Enter your project ID (found in Railway dashboard URL)" -ForegroundColor Yellow
        $projectId = Read-Host "Project ID"
        railway link $projectId
    }
}

Write-Host "✅ Project linked" -ForegroundColor Green
Write-Host ""

# Check for required environment variables
Write-Host "⚙️  Checking environment variables..." -ForegroundColor Yellow

$dbUrl = railway variables 2>&1 | Select-String "DATABASE_URL"
if (-not $dbUrl) {
    Write-Host "⚠️  DATABASE_URL not set. You'll need to:" -ForegroundColor Yellow
    Write-Host "   1. Add PostgreSQL service in Railway dashboard" -ForegroundColor Gray
    Write-Host "   2. Copy the DATABASE_URL" -ForegroundColor Gray
    Write-Host "   3. Run: railway variables set DATABASE_URL='your-url'" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
}

Write-Host ""
Write-Host "🚀 Starting deployment..." -ForegroundColor Cyan
Write-Host "   This may take several minutes..." -ForegroundColor Gray
Write-Host ""

# Deploy
railway up

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Check deployment status: railway status" -ForegroundColor Gray
Write-Host "   2. View logs: railway logs" -ForegroundColor Gray
Write-Host "   3. Get public URL: railway domain" -ForegroundColor Gray
Write-Host "   4. Set environment variables: railway variables" -ForegroundColor Gray
Write-Host ""

