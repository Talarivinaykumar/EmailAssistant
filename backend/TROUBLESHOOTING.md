# Troubleshooting Guide for Email Assistant Backend

## Issues Identified and Fixed

### 1. Intent Analysis Not Working (Returning UNKNOWN)

**Problem**: AI service was returning `UNKNOWN` intent for all emails.

**Root Cause**: 
- Mismatch between intent categories in configuration and Email model enum values
- Configuration had `FEATURE_INQUIRY` and `GENERAL_SUPPORT` but model had `FEATURE_REQUEST` and `GENERAL_INQUIRY`

**Fix Applied**:
- Updated `application.yml` to use correct intent names
- Fixed team assignment rules to match intent names
- Enhanced error handling in AI service

### 2. Team Assignment Not Working

**Problem**: Teams were not being assigned to emails even when intent was detected.

**Root Cause**:
- Teams didn't exist in the database
- Team assignment service was looking for teams by name but they didn't exist
- No fallback mechanism when teams weren't found

**Fix Applied**:
- Created `DataInitializationService` to automatically create default teams on startup
- Updated `TeamAssignmentService` to use fallback logic when teams aren't found by name
- Added default teams to MongoDB initialization script
- Enhanced team assignment logic to find teams by handled intents

### 3. AI Reply Generation Issues

**Problem**: AI service was not generating replies properly.

**Root Cause**:
- Configuration issues with OpenAI API
- Poor error handling in AI service
- Missing validation for AI responses

**Fix Applied**:
- Enhanced error handling in `OpenAiServiceImpl`
- Added better JSON parsing with fallbacks
- Created test endpoints to debug AI service issues
- Added comprehensive logging for debugging

## How to Test the Fixes

### 1. Test Intent Analysis

```bash
# Test intent analysis with sample email
curl -X POST "http://localhost:8080/api/test/analyze-intent" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "subject=Refund Request&body=I need a refund for my order"
```

### 2. Test Sentiment Analysis

```bash
# Test sentiment analysis
curl -X POST "http://localhost:8080/api/test/analyze-sentiment" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "content=I'm very unhappy with your service"
```

### 3. Test Team Assignment

```bash
# Test team assignment for different intents
curl -X POST "http://localhost:8080/api/test/test-team-assignment" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "intent=REFUND_REQUEST"
```

### 4. Test Health Check

```bash
# Check if service is running
curl "http://localhost:8080/api/test/health"
```

## Required Environment Variables

Make sure these are set in your `.env` file:

```bash
# Required for AI features to work
OPENAI_API_KEY=your-actual-openai-api-key

# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/email_assistant

# Optional: Email configuration
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Steps to Verify Fixes

### 1. Restart the Application

```bash
# Stop the current application
# Then restart with:
mvn spring-boot:run
```

### 2. Check Logs

Look for these log messages on startup:
```
INFO  - Initializing default data...
INFO  - Created team: billing-team
INFO  - Created team: technical-team
INFO  - Created team: product-team
INFO  - Created team: support-team
INFO  - Data initialization completed
```

### 3. Test Email Processing

Send a test email through the API:

```bash
curl -X POST "http://localhost:8080/api/emails" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@example.com",
    "to": "support@company.com",
    "subject": "I need a refund",
    "body": "Please process my refund request"
  }'
```

### 4. Check Database

Verify teams were created:

```bash
# Connect to MongoDB
mongosh email_assistant

# Check teams
db.teams.find()

# Check emails
db.emails.find()
```

## Expected Behavior After Fixes

1. **Intent Analysis**: Should return specific intents like `REFUND_REQUEST`, `BUG_REPORT`, etc.
2. **Team Assignment**: Emails should be automatically assigned to appropriate teams
3. **AI Reply Generation**: Should generate contextual replies based on email content
4. **Status Updates**: Email status should progress from `RECEIVED` → `PROCESSING` → `INTENT_DETECTED` → `ASSIGNED`

## Common Issues and Solutions

### Issue: Still getting UNKNOWN intent

**Solution**: Check if OpenAI API key is set correctly and API is accessible.

### Issue: Teams still not being assigned

**Solution**: Verify that teams were created in the database and have the correct `handledIntents` array.

### Issue: AI service errors

**Solution**: Check OpenAI API quota and ensure the model specified in config is available.

## Monitoring and Debugging

### Enable Debug Logging

Add to `application.yml`:
```yaml
logging:
  level:
    com.emailassistant: DEBUG
    com.emailassistant.service: DEBUG
```

### Check Application Metrics

Monitor these endpoints:
- `/api/test/health` - Service health
- `/api/emails/statistics` - Email processing stats
- `/api/test/*` - Test endpoints for debugging

## Next Steps

1. **Test the fixes** using the test endpoints
2. **Monitor logs** for any remaining issues
3. **Verify team assignment** is working correctly
4. **Test AI reply generation** with different email types
5. **Monitor performance** and adjust as needed

If issues persist, check the logs for specific error messages and use the test endpoints to isolate the problem.
