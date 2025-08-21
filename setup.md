# AI-Powered Email Assistant Setup Guide

This guide will help you set up and run the complete AI-powered email assistant system.

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MongoDB 4.4 or higher
- OpenAI API key

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd Email

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/email_assistant

# Email Server Configuration (optional for testing)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Application Configuration
SPRING_PROFILES_ACTIVE=dev
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Build the application
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000`

## Features Overview

### ✅ Implemented Features

1. **Email Ingestion with GPT-Based Intent Detection**
   - Automatic email processing and storage
   - AI-powered intent classification
   - Sentiment analysis and urgency detection

2. **Automatic Team Assignment**
   - Rule-based team assignment
   - Configurable assignment rules
   - Load balancing across teams

3. **AI-Generated Replies with Feedback**
   - Context-aware reply generation
   - Tone and clarity feedback
   - Multiple tone and style options

4. **Manual Reassignment Dashboard**
   - Email list with filtering
   - Manual assignment capabilities
   - Status and priority management

5. **Admin Panel**
   - Team management
   - Assignment rules configuration
   - Performance tracking
   - System health monitoring

### 🔧 Technical Features

- **Backend**: Spring Boot 3.x with MongoDB
- **Frontend**: React 18 with TypeScript and Tailwind CSS
- **AI Integration**: OpenAI GPT-4 for content analysis
- **Real-time Updates**: WebSocket support (ready for implementation)
- **API Documentation**: Swagger UI at `/swagger-ui.html`

## API Endpoints

### Email Management
- `POST /api/emails` - Process incoming email
- `GET /api/emails` - Get all emails with filtering
- `GET /api/emails/{id}` - Get email by ID
- `PUT /api/emails/{id}/status/{status}` - Update email status
- `PUT /api/emails/{id}/priority/{priority}` - Update email priority
- `POST /api/emails/ai/reply` - Generate AI reply

### Team Management
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team
- `GET /api/teams/assignment-rules` - Get assignment rules

### Statistics
- `GET /api/emails/statistics` - Get email statistics

## Database Schema

### Email Collection
```json
{
  "id": "string",
  "messageId": "string",
  "from": "string",
  "to": "string",
  "subject": "string",
  "body": "string",
  "status": "RECEIVED|PROCESSING|ASSIGNED|RESPONDED|CLOSED",
  "intent": "REFUND_REQUEST|BUG_REPORT|FEATURE_INQUIRY|...",
  "intentConfidence": "number",
  "assignedTeam": "string",
  "assignedUser": "string",
  "priority": "LOW|MEDIUM|HIGH|URGENT",
  "receivedAt": "datetime",
  "aiGeneratedReply": "string",
  "finalReply": "string"
}
```

### Team Collection
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "memberIds": ["string"],
  "handledIntents": ["REFUND_REQUEST", "BUG_REPORT"],
  "status": "ACTIVE|INACTIVE|ARCHIVED"
}
```

## Configuration Options

### Email Processing
- Batch size: 10 emails
- Poll interval: 30 seconds
- Max retries: 3 attempts

### AI Configuration
- Model: GPT-4
- Max tokens: 1000
- Temperature: 0.7

### Intent Categories
- REFUND_REQUEST
- BUG_REPORT
- FEATURE_INQUIRY
- GENERAL_SUPPORT
- BILLING_ISSUE
- TECHNICAL_SUPPORT
- COMPLAINT
- FEEDBACK

## Testing the System

### 1. Test Email Processing

Send a POST request to `http://localhost:8080/api/emails`:

```json
{
  "from": "customer@example.com",
  "to": "support@company.com",
  "subject": "Bug Report - App Crashes",
  "body": "The app keeps crashing when I try to upload files. This is very frustrating and I need help immediately."
}
```

### 2. Test AI Reply Generation

Send a POST request to `http://localhost:8080/api/emails/ai/reply`:

```json
{
  "emailId": "email_id_here",
  "tone": "professional",
  "style": "empathetic",
  "includeToneFeedback": true,
  "includeClarityFeedback": true
}
```

### 3. Test Team Assignment

Update assignment rules via the admin panel or API:

```bash
curl -X PUT "http://localhost:8080/api/teams/assignment-rules/BUG_REPORT?teamName=technical-team"
```

## Deployment

### Backend Deployment (AWS)

1. **EC2 Setup**:
   ```bash
   # Install Java and MongoDB
   sudo apt update
   sudo apt install openjdk-17-jdk mongodb
   
   # Build and run
   ./mvnw clean package
   java -jar target/email-assistant-backend-1.0.0.jar
   ```

2. **Elastic Beanstalk**:
   - Create application
   - Upload the JAR file
   - Configure environment variables

### Frontend Deployment (Netlify/Vercel)

1. **Build the application**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

3. **Deploy to Vercel**:
   - Import GitHub repository
   - Set framework preset: Create React App
   - Deploy

## Monitoring and Maintenance

### Health Checks
- Database connectivity
- OpenAI API status
- Email processing queue
- System performance metrics

### Logs
- Application logs: `/var/log/email-assistant/`
- MongoDB logs: `/var/log/mongodb/`
- System logs: `journalctl -u email-assistant`

### Backup
- MongoDB backup: `mongodump --db email_assistant`
- Configuration backup: `/etc/email-assistant/`

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Check API key validity
   - Verify account has sufficient credits
   - Check rate limits

2. **MongoDB Connection Issues**
   - Verify MongoDB is running
   - Check connection string
   - Ensure database exists

3. **Email Processing Failures**
   - Check email server configuration
   - Verify SMTP credentials
   - Check firewall settings

### Performance Optimization

1. **Database Indexing**
   ```javascript
   db.emails.createIndex({ "status": 1 })
   db.emails.createIndex({ "assignedTeam": 1 })
   db.emails.createIndex({ "receivedAt": -1 })
   ```

2. **Caching**
   - Redis for session management
   - Application-level caching for team data
   - CDN for static assets

3. **Scaling**
   - Horizontal scaling with load balancer
   - Database sharding for large datasets
   - Microservices architecture for complex deployments

## Support

For issues and questions:
- Check the API documentation at `/swagger-ui.html`
- Review application logs
- Create an issue in the repository

## License

This project is licensed under the MIT License.
