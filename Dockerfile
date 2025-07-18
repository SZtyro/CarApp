FROM openjdk:17-jdk-slim as build

WORKDIR /app

COPY pom.xml .
COPY src ./src
COPY .m2/settings.xml /root/.m2/settings.xml
COPY .npmrc /root/.npmrc
COPY CHANGELOG.md ./

RUN apt-get update && apt-get install -y maven
RUN mvn clean install -Dmaven.test.skip=true -P production

FROM tomcat:9-jdk17-openjdk-slim

COPY --from=build /app/target/carApp.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
