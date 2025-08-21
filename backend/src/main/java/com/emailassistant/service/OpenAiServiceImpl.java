// package com.emailassistant.service;

// import com.emailassistant.dto.AiReplyRequest;
// import com.emailassistant.dto.AiReplyResponse;
// import com.emailassistant.model.Email;
// import com.theokanning.openai.completion.chat.ChatCompletionRequest;
// import com.theokanning.openai.completion.chat.ChatMessage;
// import com.theokanning.openai.service.OpenAiService;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// import java.time.Duration;
// import java.util.*;
// import java.util.concurrent.CompletableFuture;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class OpenAiServiceImpl implements AiService {

//     private final com.theokanning.openai.service.OpenAiService openAiService;
    
//     @Value("${openai.model}")
//     private String model;
    
//     @Value("${openai.max-tokens}")
//     private Integer maxTokens;
    
//     @Value("${openai.temperature}")
//     private Double temperature;

//     @Override
//     public Email.IntentAnalysisResult analyzeIntent(String subject, String body) {
//         try {
//             String prompt = buildIntentAnalysisPrompt(subject, body);
            
//             ChatCompletionRequest request = ChatCompletionRequest.builder()
//                     .model(model)
//                     .messages(Arrays.asList(
//                             new ChatMessage("system", "You are an expert email classifier. Analyze the email and determine the intent."),
//                             new ChatMessage("user", prompt)
//                     ))
//                     .maxTokens(maxTokens)
//                     .temperature(temperature)
//                     .build();

//             String response = openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();
            
//             return parseIntentResponse(response);
//         } catch (Exception e) {
//             log.error("Error analyzing intent: {}", e.getMessage(), e);
//             return Email.IntentAnalysisResult.builder()
//                     .intent(Email.EmailIntent.UNKNOWN)
//                     .confidence(0.0)
//                     .reasoning("Error in analysis")
//                     .build();
//         }
//     }

//     @Override
//     public AiReplyResponse generateReply(AiReplyRequest request, Email email) {
//         try {
//             if (email == null) {
//                 throw new RuntimeException("Email cannot be null");
//             }
            
//             String prompt = buildReplyGenerationPrompt(email, request);
            
//             ChatCompletionRequest chatRequest = ChatCompletionRequest.builder()
//                     .model(model)
//                     .messages(Arrays.asList(
//                             new ChatMessage("system", "You are a professional customer support agent. Generate a helpful and appropriate reply."),
//                             new ChatMessage("user", prompt)
//                     ))
//                     .maxTokens(maxTokens)
//                     .temperature(temperature)
//                     .build();

//             String generatedReply = openAiService.createChatCompletion(chatRequest).getChoices().get(0).getMessage().getContent();
            
//             // Analyze the generated reply for tone and clarity
//             List<AiReplyResponse.FeedbackItem> toneFeedback = new ArrayList<>();
//             List<AiReplyResponse.FeedbackItem> clarityFeedback = new ArrayList<>();
            
//             if (Boolean.TRUE.equals(request.getIncludeToneFeedback())) {
//                 toneFeedback = analyzeTone(generatedReply);
//             }
            
//             if (Boolean.TRUE.equals(request.getIncludeClarityFeedback())) {
//                 clarityFeedback = analyzeClarity(generatedReply);
//             }
            
//             return AiReplyResponse.builder()
//                     .emailId(request.getEmailId())
//                     .generatedReply(generatedReply)
//                     .tone(request.getTone())
//                     .style(request.getStyle())
//                     .toneFeedback(toneFeedback)
//                     .clarityFeedback(clarityFeedback)
//                     .confidenceScore(0.85)
//                     .modelUsed(model)
//                     .processingTimeMs(System.currentTimeMillis())
//                     .build();
                    
//         } catch (Exception e) {
//             log.error("Error generating reply: {}", e.getMessage(), e);
//             throw new RuntimeException("Failed to generate reply", e);
//         }
//     }

//     @Override
//     public Email.SentimentAnalysisResult analyzeSentiment(String content) {
//         try {
//             String prompt = buildSentimentAnalysisPrompt(content);
            
//             ChatCompletionRequest request = ChatCompletionRequest.builder()
//                     .model(model)
//                     .messages(Arrays.asList(
//                             new ChatMessage("system", "You are an expert sentiment analyzer. Analyze the sentiment and urgency of the text."),
//                             new ChatMessage("user", prompt)
//                     ))
//                     .maxTokens(maxTokens)
//                     .temperature(temperature)
//                     .build();

//             String response = openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();
            
//             return parseSentimentResponse(response);
//         } catch (Exception e) {
//             log.error("Error analyzing sentiment: {}", e.getMessage(), e);
//             return Email.SentimentAnalysisResult.builder()
//                     .sentiment("neutral")
//                     .score(0.0)
//                     .urgency("low")
//                     .language("en")
//                     .customerTier("standard")
//                     .build();
//         }
//     }

//     @Override
//     public List<AiReplyResponse.FeedbackItem> analyzeReplyQuality(String reply, String originalEmail) {
//         try {
//             String prompt = buildQualityAnalysisPrompt(reply, originalEmail);
            
//             ChatCompletionRequest request = ChatCompletionRequest.builder()
//                     .model(model)
//                     .messages(Arrays.asList(
//                             new ChatMessage("system", "You are an expert in communication quality. Analyze the reply for tone and clarity."),
//                             new ChatMessage("user", prompt)
//                     ))
//                     .maxTokens(maxTokens)
//                     .temperature(temperature)
//                     .build();

//             String response = openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();
            
//             return parseQualityFeedback(response);
//         } catch (Exception e) {
//             log.error("Error analyzing reply quality: {}", e.getMessage(), e);
//             return new ArrayList<>();
//         }
//     }

//     private String buildIntentAnalysisPrompt(String subject, String body) {
//         return String.format("""
//             Analyze the following email and determine the customer's intent:
            
//             Subject: %s
//             Body: %s
            
//             Intent categories:
//             - REFUND_REQUEST: Customer wants a refund
//             - BUG_REPORT: Customer reports a bug or technical issue
//             - FEATURE_INQUIRY: Customer asks about features or capabilities
//             - GENERAL_SUPPORT: General customer support questions
//             - BILLING_ISSUE: Billing or payment related issues
//             - TECHNICAL_SUPPORT: Technical problems or questions
//             - COMPLAINT: Customer complaints or dissatisfaction
//             - FEEDBACK: Customer feedback or suggestions
            
//             Respond in JSON format:
//             {
//                 "intent": "INTENT_CATEGORY",
//                 "confidence": 0.95,
//                 "reasoning": "Brief explanation",
//                 "intentScores": {
//                     "REFUND_REQUEST": 0.1,
//                     "BUG_REPORT": 0.8,
//                     "FEATURE_INQUIRY": 0.05,
//                     ...
//                 }
//             }
//             """, subject, body);
//     }

//     private String buildReplyGenerationPrompt(Email email, AiReplyRequest request) {
//         return String.format("""
//             Generate a professional reply to this customer email:
            
//             Original Email:
//             From: %s
//             Subject: %s
//             Body: %s
            
//             Intent: %s
            
//             Requirements:
//             - Tone: %s
//             - Style: %s
//             - Additional Context: %s
            
//             Generate a helpful, professional, and empathetic reply that addresses the customer's needs.
//             """, 
//             email.getFrom(), 
//             email.getSubject(), 
//             email.getBody(),
//             email.getIntent(),
//             request.getTone() != null ? request.getTone() : "professional",
//             request.getStyle() != null ? request.getStyle() : "detailed",
//             request.getAdditionalContext() != null ? request.getAdditionalContext() : "none"
//         );
//     }

//     private String buildSentimentAnalysisPrompt(String content) {
//         return String.format("""
//             Analyze the sentiment and urgency of this text:
            
//             Text: %s
            
//             Respond in JSON format:
//             {
//                 "sentiment": "positive|negative|neutral",
//                 "score": 0.85,
//                 "urgency": "low|medium|high|urgent",
//                 "language": "en",
//                 "customerTier": "standard|premium|enterprise"
//             }
//             """, content);
//     }

//     private String buildQualityAnalysisPrompt(String reply, String originalEmail) {
//         return String.format("""
//             Analyze the quality of this reply to the original email:
            
//             Original Email: %s
//             Reply: %s
            
//             Provide feedback on tone and clarity. Respond in JSON format:
//             {
//                 "toneFeedback": [
//                     {
//                         "category": "professionalism",
//                         "suggestion": "Consider using more formal language",
//                         "reason": "The tone is too casual for a business context",
//                         "severity": "medium"
//                     }
//                 ],
//                 "clarityFeedback": [
//                     {
//                         "category": "structure",
//                         "suggestion": "Break down the response into bullet points",
//                         "reason": "The response is too long and dense",
//                         "severity": "high"
//                     }
//                 ]
//             }
//             """, originalEmail, reply);
//     }

//     private Email.IntentAnalysisResult parseIntentResponse(String response) {
//         // Simple JSON parsing - in production, use a proper JSON library
//         try {
//             // Extract intent from response
//             String intent = extractJsonValue(response, "intent");
//             String confidence = extractJsonValue(response, "confidence");
//             String reasoning = extractJsonValue(response, "reasoning");
            
//             // Validate intent before parsing
//             Email.EmailIntent emailIntent;
//             try {
//                 if (intent != null && !intent.trim().isEmpty()) {
//                     emailIntent = Email.EmailIntent.valueOf(intent.toUpperCase());
//                 } else {
//                     log.warn("Empty intent value from AI, using UNKNOWN");
//                     emailIntent = Email.EmailIntent.UNKNOWN;
//                 }
//             } catch (IllegalArgumentException e) {
//                 log.warn("Invalid intent value from AI: {}, using UNKNOWN", intent);
//                 emailIntent = Email.EmailIntent.UNKNOWN;
//             }
            
//             // Parse confidence with fallback
//             double confidenceValue = 0.0;
//             try {
//                 if (confidence != null && !confidence.trim().isEmpty()) {
//                     confidenceValue = Double.parseDouble(confidence);
//                 }
//             } catch (NumberFormatException e) {
//                 log.warn("Invalid confidence value from AI: {}, using 0.0", confidence);
//             }
            
//             return Email.IntentAnalysisResult.builder()
//                     .intent(emailIntent)
//                     .confidence(confidenceValue)
//                     .reasoning(reasoning != null ? reasoning : "AI analysis completed")
//                     .intentScores(new HashMap<>())
//                     .build();
//         } catch (Exception e) {
//             log.error("Error parsing intent response: {}", e.getMessage());
//             return Email.IntentAnalysisResult.builder()
//                     .intent(Email.EmailIntent.UNKNOWN)
//                     .confidence(0.0)
//                     .reasoning("Error parsing response: " + e.getMessage())
//                     .build();
//         }
//     }

//     private Email.SentimentAnalysisResult parseSentimentResponse(String response) {
//         try {
//             String sentiment = extractJsonValue(response, "sentiment");
//             String score = extractJsonValue(response, "score");
//             String urgency = extractJsonValue(response, "urgency");
//             String language = extractJsonValue(response, "language");
//             String customerTier = extractJsonValue(response, "customerTier");
            
//             return Email.SentimentAnalysisResult.builder()
//                     .sentiment(sentiment)
//                     .score(Double.parseDouble(score))
//                     .urgency(urgency)
//                     .language(language)
//                     .customerTier(customerTier)
//                     .build();
//         } catch (Exception e) {
//             log.error("Error parsing sentiment response: {}", e.getMessage());
//             return Email.SentimentAnalysisResult.builder()
//                     .sentiment("neutral")
//                     .score(0.0)
//                     .urgency("low")
//                     .language("en")
//                     .customerTier("standard")
//                     .build();
//         }
//     }

//     private List<AiReplyResponse.FeedbackItem> parseQualityFeedback(String response) {
//         List<AiReplyResponse.FeedbackItem> feedback = new ArrayList<>();
//         try {
//             // Parse tone and clarity feedback from response
//             // This is a simplified implementation
//             feedback.add(AiReplyResponse.FeedbackItem.builder()
//                     .category("tone")
//                     .suggestion("Consider the tone")
//                     .reason("AI analysis")
//                     .severity("medium")
//                     .build());
//         } catch (Exception e) {
//             log.error("Error parsing quality feedback: {}", e.getMessage());
//         }
//         return feedback;
//     }

//     private List<AiReplyResponse.FeedbackItem> analyzeTone(String reply) {
//         // Simplified tone analysis
//         List<AiReplyResponse.FeedbackItem> feedback = new ArrayList<>();
        
//         if (reply.toLowerCase().contains("sorry") || reply.toLowerCase().contains("apologize")) {
//             feedback.add(AiReplyResponse.FeedbackItem.builder()
//                     .category("empathy")
//                     .suggestion("Good use of empathy")
//                     .reason("Contains appropriate apologies")
//                     .severity("low")
//                     .build());
//         }
        
//         return feedback;
//     }

//     private List<AiReplyResponse.FeedbackItem> analyzeClarity(String reply) {
//         // Simplified clarity analysis
//         List<AiReplyResponse.FeedbackItem> feedback = new ArrayList<>();
        
//         if (reply.length() > 500) {
//             feedback.add(AiReplyResponse.FeedbackItem.builder()
//                     .category("length")
//                     .suggestion("Consider making the response more concise")
//                     .reason("Response is quite long")
//                     .severity("medium")
//                     .build());
//         }
        
//         return feedback;
//     }

//     private String extractJsonValue(String json, String key) {
//         // Simple JSON value extraction - in production, use Jackson or Gson
//         String pattern = "\"" + key + "\"\\s*:\\s*\"([^\"]+)\"";
//         java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
//         java.util.regex.Matcher m = p.matcher(json);
//         if (m.find()) {
//             return m.group(1);
//         }
        
//         // Try to extract numeric values
//         pattern = "\"" + key + "\"\\s*:\\s*([0-9.]+)";
//         p = java.util.regex.Pattern.compile(pattern);
//         m = p.matcher(json);
//         if (m.find()) {
//             return m.group(1);
//         }
        
//         return "";
//     }

// }


package com.emailassistant.service;

import com.emailassistant.dto.AiReplyRequest;
import com.emailassistant.dto.AiReplyResponse;
import com.emailassistant.model.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAiServiceImpl implements AiService {

    private final GeminiApiClient geminiApiClient;

    // Simulate team members' loads
    private static final List<String> TEAM_MEMBERS =
            Arrays.asList("alice@example.com", "bob@example.com", "carol@example.com");

    private final Map<String, AtomicInteger> memberLoad = new ConcurrentHashMap<>();

    {
        TEAM_MEMBERS.forEach(name -> memberLoad.put(name, new AtomicInteger(0)));
    }

    // Utility: Assign to member with least emails
    private String assignToTeamMember() {
        return memberLoad.entrySet()
                .stream()
                .min(Comparator.comparingInt(e -> e.getValue().get()))
                .map(Map.Entry::getKey)
                .orElse("unassigned@example.com");
    }

    // After assignment, increment their email count
    private void incrementLoad(String member) {
        memberLoad.get(member).incrementAndGet();
    }

    @Override
    public Email.IntentAnalysisResult analyzeIntent(String subject, String body) {
        try {
            String prompt = buildIntentAnalysisPrompt(subject, body);
            String response = geminiApiClient.getChatCompletion(prompt);
            return parseIntentResponse(response);
        } catch (Exception e) {
            log.error("Error analyzing intent: {}", e.getMessage(), e);
            return Email.IntentAnalysisResult.builder()
                    .intent(Email.EmailIntent.UNKNOWN)
                    .confidence(0.0)
                    .reasoning("Error in analysis")
                    .build();
        }
    }

    @Override
    public AiReplyResponse generateReply(AiReplyRequest request, Email email) {
        try {
            if (email == null) {
                throw new RuntimeException("Email cannot be null");
            }
            // Assign email to team member
            String assignedTo = assignToTeamMember();
            incrementLoad(assignedTo);

            String prompt = buildReplyGenerationPrompt(email, request);
            String generatedReply = geminiApiClient.getChatCompletion(prompt);

            // For feedback, you could still call Gemini, but here it's kept simple as original
            List<AiReplyResponse.FeedbackItem> toneFeedback = new ArrayList<>();
            List<AiReplyResponse.FeedbackItem> clarityFeedback = new ArrayList<>();

            if (Boolean.TRUE.equals(request.getIncludeToneFeedback())) {
                toneFeedback = analyzeTone(generatedReply);
            }

            if (Boolean.TRUE.equals(request.getIncludeClarityFeedback())) {
                clarityFeedback = analyzeClarity(generatedReply);
            }

            return AiReplyResponse.builder()
                    .emailId(request.getEmailId())
                    .generatedReply(generatedReply)
                    .tone(request.getTone())
                    .style(request.getStyle())
                    .toneFeedback(toneFeedback)
                    .clarityFeedback(clarityFeedback)
                    .confidenceScore(0.85)
                    .modelUsed("Gemini-Free")
                    .processingTimeMs(System.currentTimeMillis())
                    .assignedTo(assignedTo)                         // add this field to your DTO if not present
                    .build();

        } catch (Exception e) {
            log.error("Error generating reply: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate reply", e);
        }
    }

    @Override
    public Email.SentimentAnalysisResult analyzeSentiment(String content) {
        try {
            String prompt = buildSentimentAnalysisPrompt(content);
            String response = geminiApiClient.getChatCompletion(prompt);
            return parseSentimentResponse(response);
        } catch (Exception e) {
            log.error("Error analyzing sentiment: {}", e.getMessage(), e);
            return Email.SentimentAnalysisResult.builder()
                    .sentiment("neutral")
                    .score(0.0)
                    .urgency("low")
                    .language("en")
                    .customerTier("standard")
                    .build();
        }
    }

    @Override
    public List<AiReplyResponse.FeedbackItem> analyzeReplyQuality(String reply, String originalEmail) {
        try {
            String prompt = buildQualityAnalysisPrompt(reply, originalEmail);
            String response = geminiApiClient.getChatCompletion(prompt);
            return parseQualityFeedback(response);
        } catch (Exception e) {
            log.error("Error analyzing reply quality: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    // Builders, Parsers (unchanged, but make sure to update parseIntentResponse to also parse the values from Gemini's response format)
    // Reuse existing prompt builders

    private String buildIntentAnalysisPrompt(String subject, String body) {
        return String.format("""
            Analyze the following email and determine the customer's intent:

            Subject: %s
            Body: %s

            Intent categories:
            - REFUND_REQUEST: Customer wants a refund
            - BUG_REPORT: Customer reports a bug or technical issue
            - FEATURE_INQUIRY: Customer asks about features or capabilities
            - GENERAL_SUPPORT: General customer support questions
            - BILLING_ISSUE: Billing or payment related issues
            - TECHNICAL_SUPPORT: Technical problems or questions
            - COMPLAINT: Customer complaints or dissatisfaction
            - FEEDBACK: Customer feedback or suggestions

            Respond strictly in JSON format:
            {
                "intent": "INTENT_CATEGORY",
                "confidence": 0.95,
                "reasoning": "Brief explanation",
                "intentScores": {
                    "REFUND_REQUEST": 0.1,
                    "BUG_REPORT": 0.8,
                    "FEATURE_INQUIRY": 0.05
                }
            }
            """, subject, body);
    }

    private String buildReplyGenerationPrompt(Email email, AiReplyRequest request) {
        return String.format("""
            Generate a professional reply to this customer email:

            Original Email:
            From: %s
            Subject: %s
            Body: %s

            Intent: %s

            Requirements:
            - Tone: %s
            - Style: %s
            - Additional Context: %s

            Generate a helpful, professional, and empathetic reply that addresses the customer's needs.
            """, 
            email.getFrom(), 
            email.getSubject(), 
            email.getBody(),
            email.getIntent(),
            request.getTone() != null ? request.getTone() : "professional",
            request.getStyle() != null ? request.getStyle() : "detailed",
            request.getAdditionalContext() != null ? request.getAdditionalContext() : "none"
        );
    }

    private String buildSentimentAnalysisPrompt(String content) {
        return String.format("""
            Analyze the sentiment and urgency of this text:

            Text: %s

            Respond in JSON format:
            {
                "sentiment": "positive|negative|neutral",
                "score": 0.85,
                "urgency": "low|medium|high|urgent",
                "language": "en",
                "customerTier": "standard|premium|enterprise"
            }
            """, content);
    }

    private String buildQualityAnalysisPrompt(String reply, String originalEmail) {
        return String.format("""
            Analyze the quality of this reply to the original email:

            Original Email: %s
            Reply: %s

            Provide feedback on tone and clarity. Respond in JSON format:
            {
                "toneFeedback": [
                    {
                        "category": "professionalism",
                        "suggestion": "Consider using more formal language",
                        "reason": "The tone is too casual for a business context",
                        "severity": "medium"
                    }
                ],
                "clarityFeedback": [
                    {
                        "category": "structure",
                        "suggestion": "Break down the response into bullet points",
                        "reason": "The response is too long and dense",
                        "severity": "high"
                    }
                ]
            }
            """, originalEmail, reply);
    }

    // Use same simple JSON parsing methods as before
    private Email.IntentAnalysisResult parseIntentResponse(String response) {
        try {
            String intent = extractJsonValue(response, "intent");
            String confidence = extractJsonValue(response, "confidence");
            String reasoning = extractJsonValue(response, "reasoning");

            Email.EmailIntent emailIntent;
            try {
                emailIntent = (intent != null && !intent.trim().isEmpty())
                        ? Email.EmailIntent.valueOf(intent.toUpperCase())
                        : Email.EmailIntent.UNKNOWN;
            } catch (IllegalArgumentException e) {
                emailIntent = Email.EmailIntent.UNKNOWN;
            }

            double confidenceValue = 0.0;
            if (confidence != null && !confidence.trim().isEmpty()) {
                try { confidenceValue = Double.parseDouble(confidence); }
                catch (NumberFormatException ignored) {}
            }

            return Email.IntentAnalysisResult.builder()
                    .intent(emailIntent)
                    .confidence(confidenceValue)
                    .reasoning(reasoning != null ? reasoning : "AI analysis completed")
                    .intentScores(new HashMap<>())
                    .build();
        } catch (Exception e) {
            return Email.IntentAnalysisResult.builder()
                    .intent(Email.EmailIntent.UNKNOWN)
                    .confidence(0.0)
                    .reasoning("Error parsing response: " + e.getMessage())
                    .build();
        }
    }

    private Email.SentimentAnalysisResult parseSentimentResponse(String response) {
        try {
            String sentiment = extractJsonValue(response, "sentiment");
            String score = extractJsonValue(response, "score");
            String urgency = extractJsonValue(response, "urgency");
            String language = extractJsonValue(response, "language");
            String customerTier = extractJsonValue(response, "customerTier");

            return Email.SentimentAnalysisResult.builder()
                    .sentiment(sentiment)
                    .score(score != null && !score.isEmpty() ? Double.parseDouble(score) : 0.0)
                    .urgency(urgency)
                    .language(language)
                    .customerTier(customerTier)
                    .build();
        } catch (Exception e) {
            return Email.SentimentAnalysisResult.builder()
                    .sentiment("neutral")
                    .score(0.0)
                    .urgency("low")
                    .language("en")
                    .customerTier("standard")
                    .build();
        }
    }

    private List<AiReplyResponse.FeedbackItem> parseQualityFeedback(String response) {
        List<AiReplyResponse.FeedbackItem> feedback = new ArrayList<>();
        feedback.add(AiReplyResponse.FeedbackItem.builder()
                .category("tone")
                .suggestion("Consider the tone")
                .reason("AI analysis")
                .severity("medium")
                .build());
        return feedback;
    }

    private List<AiReplyResponse.FeedbackItem> analyzeTone(String reply) {
        List<AiReplyResponse.FeedbackItem> feedback = new ArrayList<>();
        if (reply.toLowerCase().contains("sorry") || reply.toLowerCase().contains("apologize")) {
            feedback.add(AiReplyResponse.FeedbackItem.builder()
                    .category("empathy")
                    .suggestion("Good use of empathy")
                    .reason("Contains appropriate apologies")
                    .severity("low")
                    .build());
        }
        return feedback;
    }

    private List<AiReplyResponse.FeedbackItem> analyzeClarity(String reply) {
        List<AiReplyResponse.FeedbackItem> feedback = new ArrayList<>();
        if (reply.length() > 500) {
            feedback.add(AiReplyResponse.FeedbackItem.builder()
                    .category("length")
                    .suggestion("Consider making the response more concise")
                    .reason("Response is quite long")
                    .severity("medium")
                    .build());
        }
        return feedback;
    }

    private String extractJsonValue(String json, String key) {
        String pattern = "\"" + key + "\"\\s*:\\s*\"([^\"]+)\"";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        // Try to extract numeric values
        pattern = "\"" + key + "\"\\s*:\\s*([0-9.]+)";
        p = java.util.regex.Pattern.compile(pattern);
        m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        return "";
    }

}
