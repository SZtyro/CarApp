ARG NODE_VERSION=22.18.0-alpine
ARG ANGULAR_VERSION=18.2.3


FROM node:${NODE_VERSION} as frontend
WORKDIR /app

RUN apk add --no-cache gettext
RUN apk add --no-cache libxml2-utils
RUN npm install -g @angular/cli@${ANGULAR_VERSION}
COPY src/main/frontend ./src/main/frontend
COPY .npmrc /root/.npmrc.template
COPY build-node.sh /usr/local/bin/build-node.sh

RUN chmod +x /usr/local/bin/build-node.sh
RUN --mount=type=secret,id=github_token \
    sh -c '/usr/local/bin/build-node.sh'

# syntax=docker/dockerfile:1.4
FROM openjdk:17.0.1-jdk-slim AS backend

WORKDIR /app

ENV MAVEN_CONFIG=/root/.m2

COPY pom.xml .
COPY src ./src
COPY CHANGELOG.md ./
COPY .m2/settings.xml $MAVEN_CONFIG/settings.xml.template
COPY --from=frontend /app/src/main/webapp/ ./src/main/resources/static
COPY build-maven.sh /usr/local/bin/build-maven.sh

RUN chmod +x /usr/local/bin/build-maven.sh && \
    apt-get update && apt-get install -y maven gettext-base && rm -rf /var/lib/apt/lists/*

RUN --mount=type=secret,id=github_token \
    /usr/local/bin/build-maven.sh



FROM tomcat:9.0.89-jdk17-temurin
WORKDIR /usr/local/tomcat/webapps

COPY --from=backend /app/target/carApp.war ./ROOT.war


EXPOSE 8080
CMD ["catalina.sh", "run"]
