package pl.sztyro.carapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import pl.sztyro.mail.MailProperties;

@SpringBootApplication(scanBasePackages = {"pl.sztyro"})
@EnableJpaRepositories({"pl.sztyro.*"})
@EntityScan({"pl.sztyro.*"})
@EnableConfigurationProperties(MailProperties.class)
@EnableScheduling
public class CarAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarAppApplication.class, args);
    }

}
