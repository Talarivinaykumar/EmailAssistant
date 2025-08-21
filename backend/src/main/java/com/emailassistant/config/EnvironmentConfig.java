package com.emailassistant.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import jakarta.annotation.PostConstruct;


@Configuration
public class EnvironmentConfig {

    @PostConstruct
    public void loadEnvironmentVariables() {
        try {
            // Load .env file
            Dotenv dotenv = Dotenv.configure()
                    .directory(".")
                    .filename(".env")
                    .ignoreIfMissing()
                    .load();
            
            // Set system properties for OpenAI
            if (dotenv.get("OPENAI_API_KEY") != null) {
                System.setProperty("openai.api-key", dotenv.get("OPENAI_API_KEY"));
            }
            
            if (dotenv.get("OPENAI_MODEL") != null) {
                System.setProperty("openai.model", dotenv.get("OPENAI_MODEL"));
            }
            
            if (dotenv.get("OPENAI_MAX_TOKENS") != null) {
                System.setProperty("openai.max-tokens", dotenv.get("OPENAI_MAX_TOKENS"));
            }
            
            if (dotenv.get("OPENAI_TEMPERATURE") != null) {
                System.setProperty("openai.temperature", dotenv.get("OPENAI_TEMPERATURE"));
            }
            
            // Set system properties for MongoDB
            if (dotenv.get("MONGODB_URI") != null) {
                System.setProperty("spring.data.mongodb.uri", dotenv.get("MONGODB_URI"));
            }
            
            System.out.println("Environment variables loaded from .env file");
            
        } catch (Exception e) {
            System.err.println("Warning: Could not load .env file: " + e.getMessage());
            System.err.println("Make sure you have created a .env file with your OpenAI API key");
        }
    }
}
