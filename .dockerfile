# Use an official OpenJDK runtime as the base image
FROM openjdk:17-jdk-slim as build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and source code into the container
COPY pom.xml .
COPY src ./src
COPY .m2 .

# Build the WAR file using Maven
RUN apt-get update && apt-get install -y maven
RUN mvn clean install

# Use an official Tomcat image to deploy the WAR file
FROM tomcat:9-jdk17-openjdk-slim

# Copy the WAR file from the build stage to the Tomcat webapps directory
COPY --from=build /app/target/carApp.war /usr/local/tomcat/webapps/ROOT.war

# Expose port 8080 (default for Tomcat)
EXPOSE 8080

# Start Tomcat in the foreground
CMD ["catalina.sh", "run"]
