package pl.sztyro.carapp.insurance;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.ActiveProfiles;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.model.InsuranceEvent;
import pl.sztyro.carapp.service.InsuranceService;
import pl.sztyro.core.service.DateService;

import javax.persistence.EntityManager;

import java.util.Calendar;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
public class InsuranceServiceTest {

    @Autowired
    private InsuranceService service;

    @Autowired
    private EntityManager em;

    @Autowired
    private DateService dateService;

    @MockBean
    private JavaMailSender javaMailSender;

    @MockBean
    private ClientRegistrationRepository repository;

    @Test
    public void shouldReturnCurrentInsurance(){
        Car test = em.merge(Car.builder().name("Test").build());

        InsuranceEvent old = em.merge(InsuranceEvent.builder()
                .car(test)
                .date(dateService.builder()
                        .add(Calendar.YEAR, -1)
                        .add(Calendar.DAY_OF_MONTH, -1)
                        .build()
                )
                .build()
        );

        InsuranceEvent current = em.merge(InsuranceEvent.builder()
                .car(test)
                .date(dateService.builder()
                        .add(Calendar.DAY_OF_MONTH, -1)
                        .build()
                )
                .build()
        );

        InsuranceEvent next = em.merge(InsuranceEvent.builder()
                .car(test)
                .date(dateService.builder()
                        .add(Calendar.YEAR, 1)
                        .add(Calendar.DAY_OF_MONTH, -1)
                        .build()
                )
                .build()
        );

        InsuranceEvent result = service.getCurrentInsurance(test.getId());

        assertNotNull(result);
        assertEquals(current.getId() , result.getId());
    }
}
