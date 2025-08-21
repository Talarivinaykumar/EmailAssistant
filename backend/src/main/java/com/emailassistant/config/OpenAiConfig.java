// package com.emailassistant.config;

// import com.emailassistant.service.EmailService;
// import com.emailassistant.service.OpenAiServiceImpl;
// import com.theokanning.openai.service.OpenAiService;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Primary;

// import java.time.Duration;

// @Configuration
// public class OpenAiConfig {

//     @Value("${OPENAI_API_KEY:}")
//     private String apiKey;

//     @Bean
//     public com.theokanning.openai.service.OpenAiService openAiClient() {
//         // Try to get API key from multiple sources
//         String finalApiKey = apiKey;
//         if (finalApiKey == null || finalApiKey.trim().isEmpty()) {
//             finalApiKey = System.getProperty("openai.api-key");
//         }
//         if (finalApiKey == null || finalApiKey.trim().isEmpty()) {
//             finalApiKey = System.getenv("OPENAI_API_KEY");
//         }
        
//         if (finalApiKey == null || finalApiKey.trim().isEmpty()) {
//             throw new IllegalStateException("OpenAI API key not found. Please set it in .env file or as environment variable OPENAI_API_KEY");
//         }
        
//         System.out.println("OpenAI API key loaded successfully");
//         return new OpenAiService(finalApiKey, Duration.ofSeconds(60));
//     }
    
//     @Bean
//     @Primary
//     public OpenAiServiceImpl openAiService() {
//         return new OpenAiServiceImpl(openAiClient());
//     }
// }



package com.emailassistant.config;

import com.emailassistant.service.GeminiApiClient;
import com.emailassistant.service.OpenAiServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class OpenAiConfig {

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    @Bean
    public GeminiApiClient geminiApiClient() {
        String finalApiKey = apiKey;
        if (finalApiKey == null || finalApiKey.trim().isEmpty()) {
            finalApiKey = System.getenv("GEMINI_API_KEY");
        }

        if (finalApiKey == null || finalApiKey.trim().isEmpty()) {
            throw new IllegalStateException("Gemini API key not found. Please set GEMINI_API_KEY as an environment variable.");
        }

        System.out.println("Gemini API key loaded successfully");
        return new GeminiApiClient(finalApiKey);
    }

    @Bean
    @Primary
    public OpenAiServiceImpl openAiService(GeminiApiClient geminiApiClient) {
        return new OpenAiServiceImpl(geminiApiClient);
    }
}
