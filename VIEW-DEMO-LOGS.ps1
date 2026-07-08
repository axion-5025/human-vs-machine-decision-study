param(
    [string]$Repository = $PSScriptRoot
)

$ErrorActionPreference = "Stop"
Set-Location $Repository

docker compose `
    --env-file ".env.release" `
    -f "infrastructure/docker-compose.release.yml" `
    ps --all

docker compose `
    --env-file ".env.release" `
    -f "infrastructure/docker-compose.release.yml" `
    logs --tail 200

Read-Host "Press Enter to close"
