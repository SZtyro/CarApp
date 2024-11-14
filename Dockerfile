# Use an official OpenJDK runtime as the base image
FROM openjdk:17-jdk-slim as build

# Set the working directory in the container
WORKDIR /app

# Ustawienie zmiennych jako ARG
ARG MAVEN_USERNAME
ARG MAVEN_PASSWORD
ARG MAVEN_URL

# Ustawienie jako zmienne środowiskowe
ENV MAVEN_REPO_USERNAME=${MAVEN_USERNAME}
ENV MAVEN_REPO_PASSWORD=${MAVEN_PASSWORD}
ENV MIRROR_URL=${MAVEN_URL}

# Copy the pom.xml and source code into the container
COPY pom.xml .
COPY src ./src
COPY .m2/settings.xml /root/.m2/settings.xml

# Build the WAR file using Maven
RUN apt-get update && apt-get install -y maven
RUN mvn clean install -Dmaven.test.skip=true

# Use an official Tomcat image to deploy the WAR file
FROM tomcat:9-jdk17-openjdk-slim

# Copy the WAR file from the build stage to the Tomcat webapps directory
COPY --from=build /app/target/carApp.war /usr/local/tomcat/webapps/ROOT.war

# Expose port 8080 (default for Tomcat)
EXPOSE 8080

# Start Tomcat in the foreground
CMD ["catalina.sh", "run"]
