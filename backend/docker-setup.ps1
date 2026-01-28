# Docker Setup Script for Referral Network Hub Backend
# Run this script to clean up old containers and start fresh

Write-Host "`n[*] Starting Docker Cleanup and Setup...`n" -ForegroundColor Cyan

# Stop the script on any error
$ErrorActionPreference = "Continue"

# Clean up old containers
Write-Host "[*] Stopping and removing old containers..." -ForegroundColor Yellow
docker stop rnh-backend rnh-postgres rnh-redis redis-rnh 2>$null
docker rm rnh-backend rnh-postgres rnh-redis redis-rnh 2>$null

# Stop docker-compose services
Write-Host "[*] Stopping docker-compose services..." -ForegroundColor Yellow
docker-compose down -v 2>$null

# Clean up volumes
Write-Host "[*] Removing old volumes..." -ForegroundColor Yellow
docker volume rm backend_postgres_data backend_redis_data 2>$null

# Optional: Clean up dangling images
Write-Host "[*] Removing dangling images..." -ForegroundColor Yellow
docker image prune -f

Write-Host "`n[SUCCESS] Cleanup complete!`n" -ForegroundColor Green

# Build and start services
Write-Host "[*] Building and starting all services (PostgreSQL + Redis + Backend)...`n" -ForegroundColor Cyan
docker-compose up -d --build

# Wait for services to be ready
Write-Host "`n[*] Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host "`n[*] Service Status:" -ForegroundColor Cyan
docker-compose ps

# Show logs
Write-Host "`n[*] Recent Logs:" -ForegroundColor Cyan
docker-compose logs --tail=30

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "[SUCCESS] Docker Setup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`n[*] Services Running:" -ForegroundColor Cyan
Write-Host "   - Backend API:       http://localhost:5000/api" -ForegroundColor White
Write-Host "   - API Docs:          http://localhost:5000/api-docs" -ForegroundColor White
Write-Host "   - Health Check:      http://localhost:5000/health" -ForegroundColor White
Write-Host "   - PostgreSQL:        localhost:5432" -ForegroundColor White
Write-Host "   - Redis:             localhost:6379" -ForegroundColor White

Write-Host "`n[*] Useful Commands:" -ForegroundColor Cyan
Write-Host "   - View logs:          docker-compose logs -f" -ForegroundColor Gray
Write-Host "   - Stop services:      docker-compose down" -ForegroundColor Gray
Write-Host "   - Restart backend:    docker-compose restart backend" -ForegroundColor Gray
Write-Host "   - Check status:       docker-compose ps`n" -ForegroundColor Gray

