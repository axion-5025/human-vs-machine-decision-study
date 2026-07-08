param(
    [string]$Repository = "C:\projects\human-vs-machine-decision-study"
)

$ErrorActionPreference = "Stop"

function Stop-WithMessage {
    param([string]$Message)
    Write-Host ""
    Write-Host $Message -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to close"
    exit 1
}

if (-not (Test-Path $Repository)) {
    Stop-WithMessage "Repository not found: $Repository"
}

Set-Location $Repository

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Stop-WithMessage "Docker is not available. Install/start Docker Desktop first."
}

try {
    docker info *> $null
} catch {
    Stop-WithMessage "Docker Desktop is not running. Start Docker Desktop, wait until it is ready, and run this script again."
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
}

Write-Host "Starting PostgreSQL..." -ForegroundColor Cyan
docker compose `
    --env-file ".env" `
    -f "infrastructure/docker-compose.yml" `
    up --detach

if ($LASTEXITCODE -ne 0) {
    Stop-WithMessage "Docker Compose failed to start the database."
}

$backendCommand = @"
`$ErrorActionPreference = 'Stop'
Set-Location '$Repository\backend'
`$Host.UI.RawUI.WindowTitle = 'Human vs Machine - Backend'

if (-not (Test-Path '.venv\Scripts\python.exe')) {
    Write-Host 'Creating backend virtual environment...' -ForegroundColor Yellow
    python -m venv .venv
    & '.\.venv\Scripts\python.exe' -m pip install --upgrade pip
    & '.\.venv\Scripts\python.exe' -m pip install -r requirements-dev.txt
}

& '.\.venv\Scripts\python.exe' -m alembic upgrade head
& '.\.venv\Scripts\python.exe' -m app.seeds.scenarios

Write-Host ''
Write-Host 'Backend: http://127.0.0.1:8000' -ForegroundColor Green
Write-Host 'Keep this window open.' -ForegroundColor Yellow
& '.\.venv\Scripts\python.exe' -m uvicorn app.main:app --host 127.0.0.1 --port 8000
"@

$frontendCommand = @"
`$ErrorActionPreference = 'Stop'
Set-Location '$Repository\frontend'
`$Host.UI.RawUI.WindowTitle = 'Human vs Machine - Frontend'

if (-not (Test-Path '.env.local')) {
    Copy-Item '.env.example' '.env.local'
}

if (-not (Test-Path 'node_modules')) {
    Write-Host 'Installing frontend dependencies...' -ForegroundColor Yellow
    npm ci
}

Write-Host ''
Write-Host 'Frontend: http://localhost:5173' -ForegroundColor Green
Write-Host 'Keep this window open.' -ForegroundColor Yellow
npm run dev -- --port 5173 --strictPort
"@

Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", $backendCommand
)

Start-Sleep -Seconds 4

Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", $frontendCommand
)

Write-Host ""
Write-Host "Database, backend, and frontend startup initiated." -ForegroundColor Green
Write-Host "The browser will open shortly." -ForegroundColor Green

Start-Sleep -Seconds 6
Start-Process "http://localhost:5173"
