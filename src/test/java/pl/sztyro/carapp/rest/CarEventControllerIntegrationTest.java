package pl.sztyro.carapp.rest;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.model.CarEvent;
import pl.sztyro.carapp.repository.CarEventRepository;
import pl.sztyro.core.rest.FilteredResult;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class CarEventControllerIntegrationTest extends BaseEventIntegrationTest {

    @Autowired
    private CarEventController controller;

    @Autowired
    private CarEventRepository repository;

    @BeforeAll
    @Override
    public void init() {
        super.init();
    }

    @Test
    public void shouldConnectToLastEvent() throws IOException {

        Car toyota = cars.findOneByName("Toyota");
        Car mercedes = cars.findOneByName("Mercedes");

        CarEvent previous = CarEvent.builder()
                .draft(false)
                .car(toyota)
                .date(new Date(2024,Calendar.JANUARY,3))
                .build();

        previous = controller.create(previous).getBody();
        controller.create(previous).getBody();

        CarEvent next = controller.create(null).getBody();
        next.setCar(toyota);
        next.setDate(new Date(2024,Calendar.JANUARY,25));

        next = controller.update(next.getId(), next);
        previous = controller.get(previous.getId()).getBody();

        assertEquals(next.getPreviousEvent().getId(), previous.getId());
        assertEquals(previous.getNextEvent().getId(), next.getId());
        assertEquals(next.getCar().getId(), previous.getCar().getId());
    }

    private void testGenerationFor() throws IOException {
        CarEvent newEntity = new CarEvent();
        newEntity = controller.create(newEntity).getBody();

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.MONTH, 3);
        calendar.set(Calendar.YEAR, 2020);

        newEntity.setDate(calendar.getTime());

        newEntity.setCar(cars.findOneByName("Toyota"));
        assertEquals("Toyota",newEntity.getCar().getName());

        newEntity = controller.update(newEntity.getId(), newEntity);
        FilteredResult<CarEvent> events = controller.getAll(Map.of("previousEvent.id", String.valueOf(newEntity.getId())));
        assertEquals(1 , events.getResults().size());

        CarEvent nextEvent = events.getResults().get(0);
        assertEquals(newEntity.getId(), nextEvent.getPreviousEvent().getId());
        assertEquals(newEntity.getNextEvent().getId(), nextEvent.getId());

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
    public void shouldThrowBadRequestWithoutCar() throws IOException {

        ResponseStatusException responseStatusException = assertThrows(ResponseStatusException.class, () -> {
            CarEvent event = new CarEvent();
            event = controller.create(event).getBody();
            event.setMileage(2233);
            controller.update(event.getId(), event);
        });
        assertThat(responseStatusException.getMessage()).isEqualTo("400 BAD_REQUEST \"Set car.\"");
    }

    @Test
    public void shouldCreateAndUpdateEntity() throws IOException {
        CarEvent carEvent = new CarEvent();
        carEvent.setMileage(123);
        carEvent.setCar(cars.findOneByName("Toyota"));

        CarEvent body = controller.create(carEvent).getBody();
        assertThat(body.getMileage()).isEqualTo(carEvent.getMileage());
        assertThat(body.getId()).isNotNull();

        body.setMileage(2222);

        CarEvent updated = controller.update(body.getId(), body);
        assertThat(updated.getMileage()).isEqualTo(2222);
    }

}