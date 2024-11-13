package pl.sztyro.carapp.rest;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.enums.CarEventType;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.model.CarEvent;
import pl.sztyro.carapp.repository.CarEventRepository;
import pl.sztyro.carapp.repository.CarRepository;
import pl.sztyro.core.model.User;
import pl.sztyro.core.repository.UserRepository;
import pl.sztyro.core.rest.FilteredResult;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest()
@ActiveProfiles({"test"})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class CarEventControllerIntegrationTest {

    @Autowired
    private CarEventController controller;

    @Autowired
    private CarEventRepository repository;

    @Autowired
    private UserRepository users;

    @Autowired
    private CarRepository cars;

    @BeforeAll
    public void init(){
        User user = new User();
        user.setEmail("user@example.com");
        users.save(user);

        Car toyota = new Car();
        toyota.setName("Toyota");
        toyota.setDraft(false);
        cars.save(toyota);

        Car mercedes = new Car();
        mercedes.setName("Mercedes");
        mercedes.setDraft(false);
        cars.save(mercedes);
    }

    @BeforeEach
    public void setUp() {
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Authentication authentication = Mockito.mock(Authentication.class);
        OAuth2User oAuth2User = Mockito.mock(OAuth2User.class);

        when(oAuth2User.getAttribute("email")).thenReturn("user@example.com");
        when(authentication.getPrincipal()).thenReturn(oAuth2User);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void shouldCreateNextInsuranceEvent() throws IOException {
        testGenerationFor(CarEventType.Insurance);
    }

    @Test
    public void shouldCreateNextInspectionEvent() throws IOException {
        testGenerationFor(CarEventType.Inspection);
    }

    @Test
    public void shouldConnectToLastEvent() throws IOException {

        Car toyota = cars.findOneByName("Toyota");
        Car mercedes = cars.findOneByName("Mercedes");

        CarEvent previous = new CarEvent();
        previous.setDraft(false);
        previous.setCar(toyota);
        previous.setType(CarEventType.Refuel);
        previous.setDate(new Date(2024,Calendar.JANUARY,3));
        previous = controller.create(previous).getBody();


        CarEvent badEntity = new CarEvent();
        badEntity.setDraft(false);
        badEntity.setCar(mercedes);
        badEntity.setType(CarEventType.Refuel);
        badEntity.setDate(new Date(2024,Calendar.JANUARY,5));
        badEntity = controller.create(previous).getBody();

        CarEvent next = controller.create(null).getBody();
        next.setType(CarEventType.Refuel);
        next.setCar(toyota);
        next.setDate(new Date(2024,Calendar.JANUARY,25));

        next = controller.update(next.getId(), next);
        previous = controller.get(previous.getId()).getBody();

        assertEquals(next.getPreviousEvent().getId(), previous.getId());
        assertEquals(previous.getNextEvent().getId(), next.getId());
        assertEquals(next.getCar().getId(), previous.getCar().getId());
    }

    private void testGenerationFor(CarEventType type) throws IOException {
        CarEvent newEntity = new CarEvent();
        newEntity = controller.create(newEntity).getBody();

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.MONTH, 3);
        calendar.set(Calendar.YEAR, 2020);

        newEntity.setDate(calendar.getTime());
        newEntity.setType(type);

        newEntity.setCar(cars.findOneByName("Toyota"));
        assertEquals("Toyota",newEntity.getCar().getName());

        newEntity = controller.update(newEntity.getId(), newEntity);
        FilteredResult<CarEvent> events = controller.getAll(Map.of("previousEvent.id", String.valueOf(newEntity.getId())));
        assertEquals(1 , events.getResults().size());

        CarEvent nextEvent = events.getResults().get(0);
        assertEquals(newEntity.getId(), nextEvent.getPreviousEvent().getId());
        assertEquals(newEntity.getNextEvent().getId(), nextEvent.getId());
        assertEquals(type, nextEvent.getType());

        Calendar c = Calendar.getInstance();
        c.setTime(nextEvent.getDate());
        assertEquals(31,c.get(Calendar.DAY_OF_MONTH));
        assertEquals(2,c.get(Calendar.MONTH));
        assertEquals(2021, c.get(Calendar.YEAR));

        assertNotNull(nextEvent.getAuthor());
        assertNotNull(nextEvent.getCar());
        assertEquals(newEntity.getCar().getId(), nextEvent.getCar().getId());
    }

    @Test
    public void shouldThrowBadRequestWithoutType() throws IOException {

        ResponseStatusException responseStatusException = assertThrows(ResponseStatusException.class, () -> {
            CarEvent event = new CarEvent();
            event = controller.create(event).getBody();
            event.setMileage(2233);
            controller.update(event.getId(), event);
        });
        assertThat(responseStatusException.getMessage()).isEqualTo("400 BAD_REQUEST \"Set event type.\"");
    }

    @Test
    public void shouldThrowBadRequestWithoutCar() throws IOException {

        ResponseStatusException responseStatusException = assertThrows(ResponseStatusException.class, () -> {
            CarEvent event = new CarEvent();
            event = controller.create(event).getBody();
            event.setMileage(2233);
            event.setType(CarEventType.Refuel);
            controller.update(event.getId(), event);
        });
        assertThat(responseStatusException.getMessage()).isEqualTo("400 BAD_REQUEST \"Set car.\"");
    }

    @Test
    public void shouldCreateAndUpdateEntity() throws IOException {
        CarEvent carEvent = new CarEvent();
        carEvent.setMileage(123);
        carEvent.setType(CarEventType.Insurance);

        CarEvent body = controller.create(carEvent).getBody();
        assertThat(body.getType()).isEqualTo(CarEventType.Insurance);
        assertThat(body.getMileage()).isEqualTo(carEvent.getMileage());
        assertThat(body.getId()).isNotNull();

        body.setMileage(2222);

        CarEvent updated = controller.update(body.getId(), body);
        assertThat(updated.getMileage()).isEqualTo(2222);
    }

}