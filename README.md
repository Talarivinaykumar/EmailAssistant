# 🚀 **Smart AI-Powered Email Assistant**

A comprehensive email management system inspired by Hiver, built with Spring Boot backend and React frontend, featuring AI-powered intent detection, automatic team assignment, and intelligent reply generation.

## ✨ **Key Features**

- **🤖 AI-Powered Intent Detection**: Automatically categorizes emails using GPT models
- **👥 Smart Team Assignment**: Routes emails to appropriate teams based on intent
- **✍️ AI-Generated Replies**: Generates contextual responses with tone and clarity feedback
- **📊 Comprehensive Dashboard**: Real-time email statistics and team performance metrics
- **🔄 Manual Override**: Allows manual reassignment and status updates
- **📱 Modern UI**: Responsive React interface with Tailwind CSS
- **🐳 Docker Ready**: Complete containerization for easy deployment

## 🏗️ **Tech Stack**

### **Backend**
- **Spring Boot 3.2.0** - Java 17 framework
- **MongoDB** - NoSQL database
- **OpenAI GPT** - AI-powered email analysis
- **Spring Mail** - Email sending capabilities
- **Spring Data MongoDB** - Database operations
- **Swagger/OpenAPI** - API documentation

### **Frontend**
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Heroicons** - Beautiful SVG icons

## 🚀 **Quick Start**

### **Prerequisites**
- Java 17+
- Node.js 18+
- MongoDB 6.0+
- OpenAI API key

### **1. Clone and Setup Backend**
```bash
cd backend
# Copy environment variables
cp env.example .env
# Edit .env with your credentials
# Start MongoDB (if not using Docker)
mongod
# Run the application
mvn spring-boot:run
```

### **2. Setup Frontend**
```bash
cd frontend
# Copy environment variables
cp env.example .env
# Install dependencies
npm install
# Start development server
npm start
```

### **3. Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger Docs**: http://localhost:8080/swagger-ui.html

## 📋 **Complete Project Flow**

### **1. Email Ingestion Flow**
```
📧 Email Received → 🔍 AI Intent Detection → 🎯 Team Assignment → 📊 Status Update
```

**Step-by-step:**
1. **Email Creation**: Use "New Email" button or process incoming emails
2. **AI Analysis**: System automatically analyzes email content using GPT
3. **Intent Classification**: Categorizes as REFUND_REQUEST, BUG_REPORT, etc.
4. **Team Routing**: Automatically assigns to appropriate team based on intent
5. **Status Tracking**: Updates email status through workflow stages

### **2. AI Reply Generation Flow**
```
📝 Select Email → 🎨 Choose Tone/Style → 🤖 Generate Reply → ✍️ Review & Send
```

**Step-by-step:**
1. **Select Email**: Click on any email from the dashboard
2. **Open AI Generator**: Click "Generate AI Reply" button
3. **Configure Parameters**: Choose tone (professional, friendly) and style (concise, detailed)
4. **Generate**: AI creates contextual reply with feedback
5. **Review & Send**: Edit if needed, then send the reply

### **3. Team Management Flow**
```
👥 Create Team → 🎯 Set Intent Rules → 📧 Auto-Assign Emails → 📊 Monitor Performance
```

**Step-by-step:**
1. **Create Teams**: Define teams with specific expertise areas
2. **Set Rules**: Configure which intents route to which teams
3. **Auto-Assignment**: System automatically routes emails based on rules
4. **Performance Tracking**: Monitor team workload and response times

### **4. Email Workflow States**
```
📨 RECEIVED → 🔍 PROCESSING → 🎯 INTENT_DETECTED → 👥 ASSIGNED → 
📝 IN_PROGRESS → ✍️ RESPONDED → ✅ CLOSED
```

## 🎯 **How to Use Each Feature**

### **📧 Creating New Emails**
1. Click "New Email" button on dashboard
2. Fill in recipient, subject, and message
3. Click "Send Email" to create and process

### **🤖 AI Reply Generation**
1. Open any email detail view
2. Click "Generate AI Reply"
3. Select tone and style preferences
4. Review generated reply and feedback
5. Edit if needed and send

### **👥 Team Management**
1. Navigate to Teams page
2. Create new teams with specific expertise
3. Set assignment rules for different email intents
4. Monitor team performance and workload

### **📊 Dashboard Analytics**
1. View real-time email statistics
2. Monitor team performance metrics
3. Track email intent distribution
4. Identify high-priority emails

### **🔄 Manual Overrides**
1. Open email detail view
2. Change status, priority, or assigned team
3. Add internal notes
4. Manually compose replies

## 🐳 **Docker Deployment**

### **Backend with MongoDB**
```bash
cd backend
docker-compose up -d
```

### **Frontend**
```bash
cd frontend
docker build -t email-assistant-frontend .
docker run -p 80:80 email-assistant-frontend
```

## 🔧 **Configuration**

### **Environment Variables**

#### **Backend (.env)**
```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/email_assistant

# OpenAI
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Email (Gmail)
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

#### **Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_NAME=Email Assistant
```

### **Gmail Setup**
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in EMAIL_PASSWORD

## 📁 **Project Structure**

```
email-assistant/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   ├── controller/     # REST API endpoints
│   │   ├── service/        # Business logic
│   │   ├── model/          # Data models
│   │   ├── dto/            # Data transfer objects
│   │   └── config/         # Configuration classes
│   ├── src/main/resources/
│   │   ├── application.yml # Main configuration
│   │   └── application-prod.yml # Production config
│   └── Dockerfile          # Backend container
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── types/          # TypeScript definitions
│   ├── Dockerfile          # Frontend container
│   └── nginx.conf          # Web server config
└── docker-compose.yml       # Full stack orchestration
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Backend won't start**
   - Check MongoDB connection
   - Verify environment variables
   - Check Java version (17+)

2. **Frontend can't connect to backend**
   - Ensure backend is running on port 8080
   - Check CORS configuration
   - Verify API URL in frontend .env

3. **AI features not working**
   - Verify OpenAI API key
   - Check API quota and billing
   - Review OpenAI service configuration

4. **Email sending fails**
   - Verify Gmail credentials
   - Check App Password setup
   - Review SMTP configuration

### **Debug Mode**
```bash
# Backend
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dlogging.level.com.emailassistant=DEBUG"

# Frontend
REACT_APP_DEBUG=true npm start
```

## 🔮 **Future Enhancements**

- **Multi-language Support**: Internationalization for global teams
- **Advanced Analytics**: Machine learning insights and predictions
- **Integration APIs**: Connect with CRM, helpdesk systems
- **Mobile App**: React Native mobile application
- **Advanced AI**: Custom model training for specific domains
- **Real-time Notifications**: WebSocket-based live updates

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 **Support**

For questions and support:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using Spring Boot and React**
