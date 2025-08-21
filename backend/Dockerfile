# ======================
# Stage 1: Build the app
# ======================
FROM maven:3.9.3-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml and source
COPY pom.xml .
COPY src ./src

# Download dependencies and build
RUN mvn clean package -DskipTests

# ======================
# Stage 2: Run the app
# ======================
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy the built JAR
COPY --from=build /app/target/email-assistant-backend-1.0.0.jar app.jar

# Create a non-root user
RUN addgroup --system javauser && adduser --system --ingroup javauser javauser
RUN chown -R javauser:javauser /app

USER javauser

# Expose port
EXPOSE 8080

# Force TLS 1.2 for MongoDB connections
CMD ["java", "-Djdk.tls.client.protocols=TLSv1.2", "-jar", "app.jar"]
