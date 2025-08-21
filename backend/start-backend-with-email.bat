@echo off
echo Starting Email Assistant Backend with Email Configuration...

REM Set Email Configuration
set EMAIL_USERNAME=your-email@gmail.com
set EMAIL_PASSWORD=your-app-password
set EMAIL_HOST=smtp.gmail.com
set EMAIL_PORT=587

REM Set OpenAI Configuration (if you have it)
set OPENAI_API_KEY=your-openai-api-key-here

REM Set MongoDB Configuration
set MONGODB_URI=mongodb://localhost:27017/email_assistant

REM Set Logging Level
set LOGGING_LEVEL_COM_EMAILASSISTANT=DEBUG

echo Environment variables set:
echo EMAIL_USERNAME=%EMAIL_USERNAME%
echo EMAIL_HOST=%EMAIL_HOST%
echo EMAIL_PORT=%EMAIL_PORT%
echo MONGODB_URI=%MONGODB_URI%
echo.

echo Starting Spring Boot application...
mvn spring-boot:run

pause
