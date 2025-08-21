@echo off
echo Setting up Email Assistant Backend Environment...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy "env.example" ".env"
    echo.
    echo IMPORTANT: Please edit the .env file and set your OpenAI API key!
    echo.
)

REM Check if OpenAI API key is set
if "%OPENAI_API_KEY%"=="" (
    echo WARNING: OPENAI_API_KEY environment variable is not set!
    echo This will prevent AI features from working.
    echo Please set it in your .env file or as an environment variable.
    echo.
) else (
    echo [x] OPENAI_API_KEY - SET (AI features should work)
)

REM Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.runCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB is not running or not accessible!
    echo Please start MongoDB before running the application.
    echo.
) else (
    echo MongoDB is running and accessible.
)

REM Check if required environment variables are set
echo.
echo Environment check:
if "%OPENAI_API_KEY%"=="" (
    echo [ ] OPENAI_API_KEY - NOT SET (AI features will not work)
) else (
    echo [x] OPENAI_API_KEY - SET
)

if "%MONGODB_URI%"=="" (
    echo [ ] MONGODB_URI - Using default (mongodb://localhost:27017/email_assistant)
) else (
    echo [x] MONGODB_URI - SET
)

echo.
echo Setup complete! 
echo.
echo To start the application:
echo 1. Ensure MongoDB is running
echo 2. Set your OpenAI API key in .env file
echo 3. Run: mvn spring-boot:run
echo.
pause
