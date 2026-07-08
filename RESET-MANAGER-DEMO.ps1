param(
    [string]$Repository = $PSScriptRoot
)

$ErrorActionPreference = "Stop"
Set-Location $Repository

Write-Host "This removes the local demo database and resets all submitted data." -ForegroundColor Yellow
$confirmation = Read-Host "Type RESET to continue"

if ($confirmation -ne "RESET") {
    Write-Host "Reset cancelled."
    exit 0
}

docker compose `
    --env-file ".env.release" `
    -f "infrastructure/docker-compose.release.yml" `
    down --volumes --remove-orphans

Write-Host ""
Write-Host "Application and local demo data were removed." -ForegroundColor Green
Read-Host "Press Enter to close"
