param(
    [string]$Repository = $PSScriptRoot
)

$ErrorActionPreference = "Stop"
Set-Location $Repository

docker compose `
    --env-file ".env.release" `
    -f "infrastructure/docker-compose.release.yml" `
    down

Write-Host ""
Write-Host "Application stopped. Database data was preserved." -ForegroundColor Green
Read-Host "Press Enter to close"
