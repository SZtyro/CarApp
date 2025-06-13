package pl.sztyro.carapp.service;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.model.InsuranceEvent;
import pl.sztyro.carapp.model.RefuelEvent;
import pl.sztyro.core.Utils;
import pl.sztyro.core.service.DateService;

import javax.persistence.EntityManager;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@SpringBootTest
class CarEventServiceTest {

    @Autowired
    private CarEventService carEventService;

    @Autowired
    private EntityManager em;

    @MockBean
    private DateService dateService;

    @MockBean
    private JavaMailSender javaMailSender;

    @MockBean
    private ClientRegistrationRepository repository;

    @Test
    @Transactional
    public void shouldReturnSummary(){
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.YEAR, 2024);
        Mockito.when(dateService.now()).thenReturn(calendar.getTime());

        Car test = em.merge(Car.builder().name("Test").build());
        em.merge(RefuelEvent.builder().car(test).date(Utils.Date.from(2023,3,10)).price(10.0).build());
        em.merge(RefuelEvent.builder().car(test).date(Utils.Date.from(2024,3,10)).price(10.0).build());
        em.merge(RefuelEvent.builder().car(test).date(Utils.Date.from(2024,3,10)).build());
        em.merge(RefuelEvent.builder().car(test).date(Utils.Date.from(2024,3,22)).price(15.0).build());
        em.merge(RefuelEvent.builder().car(test).date(Utils.Date.from(2024,4,22)).price(15.0).build());
        em.merge(InsuranceEvent.builder().car(test).date(Utils.Date.from(2024,3,1)).price(800.0).build());

        CarEventService.CarEventSummary summary = carEventService.getSummary(test.getId());
        List<CarEventService.CarEventSummaryDetails> march = summary.getMarch();
        List<CarEventService.CarEventSummaryDetails> april = summary.getApril();
        assertEquals(2, march.size());

        CarEventService.CarEventSummaryDetails onlyRefuelsMarch = march.stream()
                .filter(e -> RefuelEvent.class.getName().equals(e.getType()))
                .findFirst()
                .orElseThrow();
        assertEquals(25.0, (double) onlyRefuelsMarch.getSum());

        CarEventService.CarEventSummaryDetails onlyInsurancesMarch = march.stream()
                .filter(e -> InsuranceEvent.class.getName().equals(e.getType()))
                .findFirst()
                .orElseThrow();
        assertEquals(800.0, (double) onlyInsurancesMarch.getSum());

        assertEquals(1, april.size());
    }
}