param(
    [string]$Repository = $PSScriptRoot
)

$ErrorActionPreference = "Stop"
Set-Location $Repository

function Fail([string]$Message) {
    Write-Host ""
    Write-Host $Message -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to close"
    exit 1
}

if (-not (Test-Path ".\infrastructure\docker-compose.release.yml")) {
    Fail "This launcher must be placed in the root of the Human vs Machine Decision Study project."
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Fail "Docker Desktop is not installed or docker.exe is not available."
}

try {
    docker info *> $null
} catch {
    Fail "Docker Desktop is not running. Start Docker Desktop, wait until it is ready, and run this launcher again."
}

if (-not (Test-Path ".\.env.release")) {
    if (-not (Test-Path ".\.env.release.example")) {
        Fail "Missing .env.release.example."
    }

    Copy-Item ".\.env.release.example" ".\.env.release"

    # Compatible with Windows PowerShell 5.1 and PowerShell 7+
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

    try {
        $rng.GetBytes($bytes)
    }
    finally {
        $rng.Dispose()
    }

    $password = -join ($bytes | ForEach-Object { $_.ToString("x2") })

    $content = Get-Content ".\.env.release" -Raw
    $content = $content.Replace(
        "replace-with-a-long-random-secret",
        $password
    )
    Set-Content ".\.env.release" $content -Encoding UTF8

    Write-Host "Created local .env.release with a generated database password." -ForegroundColor Green
}

Write-Host ""
Write-Host "Validating release configuration..." -ForegroundColor Cyan
docker compose `
    --env-file ".env.release" `
    -f "infrastructure/docker-compose.release.yml" `
    config --quiet

if ($LASTEXITCODE -ne 0) {
    Fail "Release configuration validation failed."
}

Write-Host "Building application containers. The first run can take several minutes..." -ForegroundColor Cyan
docker compose `
    --env-file ".env.release" `
    -f "infrastructure/docker-compose.release.yml" `
    build --pull

if ($LASTEXITCODE -ne 0) {
    Fail "Docker image build failed."
}

Write-Host "Starting PostgreSQL, migrations, seed data, backend, and frontend..." -ForegroundColor Cyan
docker compose `
    --env-file ".env.release" `
    -f "infrastructure/docker-compose.release.yml" `
    up --detach

if ($LASTEXITCODE -ne 0) {
    Fail "The application stack failed to start."
}

$url = "http://localhost:8080"
$ready = $false

Write-Host "Waiting for the application to become healthy..." -ForegroundColor Cyan

for ($attempt = 1; $attempt -le 60; $attempt++) {
    try {
        $response = Invoke-WebRequest `
            -Uri "$url/health/database" `
            -UseBasicParsing `
            -TimeoutSec 3

        if ($response.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 3
    }
}

if (-not $ready) {
    Write-Host ""
    Write-Host "The containers started, but the health check did not become ready." -ForegroundColor Yellow
    Write-Host "Run VIEW-DEMO-LOGS.ps1 for diagnostic output." -ForegroundColor Yellow
    Read-Host "Press Enter to close"
    exit 1
}

Write-Host ""
Write-Host "Human vs Machine Decision Study is ready." -ForegroundColor Green
Write-Host $url -ForegroundColor Green
Write-Host ""
Write-Host "Keep Docker Desktop running while using the application." -ForegroundColor Yellow

Start-Process $url
