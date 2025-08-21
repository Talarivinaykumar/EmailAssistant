@echo off
echo Starting Email Assistant Backend...
echo.

echo Setting environment variables...
set OPENAI_API_KEY=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
set MONGODB_URI=mongodb://localhost:27017/email_assistant
set EMAIL_USERNAME=tvk22301@gmail.com
set EMAIL_PASSWORD=pytt jtwz nxwb rldr

echo.
echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8080
echo Swagger UI will be available at: http://localhost:8080/swagger-ui.html
echo.

mvn spring-boot:run

pause
