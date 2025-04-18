FROM openjdk:17-jdk-slim as build

WORKDIR /app

ARG MAVEN_USERNAME
ARG MAVEN_PASSWORD
ARG MAVEN_URL
ARG NPM_URL

ENV MAVEN_REPO_USERNAME=${MAVEN_USERNAME}
ENV MAVEN_REPO_PASSWORD=${MAVEN_PASSWORD}
ENV MAVEN_URL=${MAVEN_URL}
ENV NPM_URL=${NPM_URL}

COPY pom.xml .
COPY src/main/frontend/.npmrc /root/.npmrc
COPY src ./src
COPY .m2/settings.xml /root/.m2/settings.xml
RUN echo "//${NPM_URL}/:_authToken=${MAVEN_PASSWORD}" > /app/src/main/frontend/.npmrc

RUN apt-get update && apt-get install -y maven
RUN mvn clean install -Dmaven.test.skip=true -P production

FROM tomcat:9-jdk17-openjdk-slim

COPY --from=build /app/target/carApp.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
