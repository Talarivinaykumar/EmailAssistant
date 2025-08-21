@echo off
echo Creating .env file with your OpenAI API key...

echo # OpenAI Configuration > .env
echo OPENAI_API_KEY=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 >> .env
echo. >> .env
echo # MongoDB Configuration >> .env
echo MONGODB_URI=mongodb://localhost:27017/email_assistant >> .env
echo. >> .env
echo # OpenAI Model Settings >> .env
echo OPENAI_MODEL=gpt-4 >> .env
echo OPENAI_MAX_TOKENS=1000 >> .env
echo OPENAI_TEMPERATURE=0.7 >> .env
echo. >> .env
echo # Email Configuration >> .env
echo EMAIL_USERNAME=your-email@gmail.com >> .env
echo EMAIL_PASSWORD=your-app-password >> .env
echo EMAIL_HOST=smtp.gmail.com >> .env
echo EMAIL_PORT=587 >> .env
echo. >> .env
echo # Application Configuration >> .env
echo SERVER_PORT=8080 >> .env
echo LOGGING_LEVEL=DEBUG >> .env

echo .env file created successfully!
echo.
echo Now you can run: mvn spring-boot:run
pause
