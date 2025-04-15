package pl.sztyro.carapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"pl.sztyro"})
@AutoConfiguration
@EnableJpaRepositories({"pl.sztyro.carapp.repository", "pl.sztyro.core.repository", "pl.sztyro.core.interfaces", "pl.sztyro.security.repository"})
@EntityScan({"pl.sztyro.carapp.model", "pl.sztyro.core.model", "pl.sztyro.security.model"})
@ComponentScan("pl.sztyro")
public class CarAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarAppApplication.class, args);
    }

}
