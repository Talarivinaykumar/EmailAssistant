// MongoDB initialization script
db = db.getSiblingDB('email_assistant');

// Create collections
db.createCollection('emails');
db.createCollection('teams');
db.createCollection('users');

// Create indexes for better performance
db.emails.createIndex({ "from": 1 });
db.emails.createIndex({ "status": 1 });
db.emails.createIndex({ "intent": 1 });
db.emails.createIndex({ "assignedTeam": 1 });
db.emails.createIndex({ "priority": 1 });
db.emails.createIndex({ "receivedAt": 1 });

db.teams.createIndex({ "name": 1 });
db.teams.createIndex({ "status": 1 });

db.users.createIndex({ "email": 1 });
db.users.createIndex({ "role": 1 });

// Insert default teams
db.teams.insertMany([
    {
        name: "billing-team",
        description: "Handles billing, refunds, and payment issues",
        handledIntents: ["REFUND_REQUEST", "BILLING_ISSUE"],
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
        totalEmailsHandled: 0
    },
    {
        name: "technical-team",
        description: "Handles technical support and bug reports",
        handledIntents: ["BUG_REPORT", "TECHNICAL_SUPPORT", "ACCOUNT_ACCESS"],
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
        totalEmailsHandled: 0
    },
    {
        name: "product-team",
        description: "Handles feature requests and product inquiries",
        handledIntents: ["FEATURE_REQUEST"],
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
        totalEmailsHandled: 0
    },
    {
        name: "support-team",
        description: "Handles general support and complaints",
        handledIntents: ["GENERAL_INQUIRY", "COMPLAINT"],
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
        totalEmailsHandled: 0
    }
]);

print('Email Assistant database initialized successfully with default teams!');
