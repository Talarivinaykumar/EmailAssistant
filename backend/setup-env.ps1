# PowerShell script to set up Email Assistant Backend Environment
Write-Host "Setting up Email Assistant Backend Environment..." -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host ""
    Write-Host "IMPORTANT: Please edit the .env file and set your OpenAI API key!" -ForegroundColor Red
    Write-Host ""
}

# Set environment variables
$env:OPENAI_API_KEY = "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"
$env:MONGODB_URI = "mongodb://localhost:27017/email_assistant"

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Cyan
try {
    $mongoTest = mongosh --eval "db.runCommand('ping')" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MongoDB is running and accessible." -ForegroundColor Green
    } else {
        Write-Host "WARNING: MongoDB is not running or not accessible!" -ForegroundColor Red
        Write-Host "Please start MongoDB before running the application." -ForegroundColor Red
    }
} catch {
    Write-Host "WARNING: MongoDB is not running or not accessible!" -ForegroundColor Red
    Write-Host "Please start MongoDB before running the application." -ForegroundColor Red
}

Write-Host ""
Write-Host "Environment check:" -ForegroundColor Cyan
if ($env:OPENAI_API_KEY) {
    Write-Host "[x] OPENAI_API_KEY - SET (AI features should work)" -ForegroundColor Green
} else {
    Write-Host "[ ] OPENAI_API_KEY - NOT SET (AI features will not work)" -ForegroundColor Red
}

if ($env:MONGODB_URI) {
    Write-Host "[x] MONGODB_URI - SET" -ForegroundColor Green
} else {
    Write-Host "[ ] MONGODB_URI - Using default (mongodb://localhost:27017/email_assistant)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Ensure MongoDB is running" -ForegroundColor White
Write-Host "2. Your OpenAI API key is now set" -ForegroundColor White
Write-Host "3. Run: mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
