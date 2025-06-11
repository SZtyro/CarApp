package pl.sztyro.carapp.rest;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.model.InsuranceEvent;
import pl.sztyro.carapp.repository.InsuranceEventRepository;
import pl.sztyro.core.model.User;

import java.io.IOException;
import java.util.Calendar;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class InsuranceEventControllerIntegrationTest extends BaseEventIntegrationTest{

    private Car othersUserCar;
    
    @Autowired
    private InsuranceEventController controller;

    @Autowired
    private InsuranceEventRepository repository;

    @BeforeAll
    @Override
    public void init() {
        super.init();
        User otherUser = users.save(User.builder().email("otherUser@test.com").build());
        othersUserCar = cars.save(Car.builder().author(otherUser).draft(false).build());
        repository.save(InsuranceEvent.builder()
                .car(othersUserCar)
                .date(dateService.builder().add(Calendar.DAY_OF_MONTH, -1).build())
                .build()
        );
        repository.save(InsuranceEvent.builder().car(toyota).build());

    }

    @Test
    public void shouldCreateNextInsuranceEvent() throws IOException {
        InsuranceEvent newEntity = InsuranceEvent.builder().build();
        newEntity = controller.create(newEntity).getBody();

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.MONTH, 3);

        newEntity.setDate(calendar.getTime());

        newEntity.setCar(cars.findOneByName("Toyota"));
        assertEquals("Toyota",newEntity.getCar().getName());

        //Save entity and generate next event
        newEntity = controller.update(newEntity.getId(), newEntity);
        //Next event should have reference to previous event
        InsuranceEvent nextEvent = repository.findByPreviousEventId(newEntity.getId()).get();

        assertNotNull(nextEvent.getPreviousEvent());
        assertEquals(newEntity.getId(), nextEvent.getPreviousEvent().getId());
        assertEquals(newEntity.getNextEvent().getId(), nextEvent.getId());

        Calendar c = Calendar.getInstance();
        c.setTime(nextEvent.getDate());
        assertEquals(31,c.get(Calendar.DAY_OF_MONTH));
        assertEquals(2,c.get(Calendar.MONTH));
        assertEquals(calendar.get(Calendar.YEAR) + 1, c.get(Calendar.YEAR));

        assertNotNull(nextEvent.getAuthor());
        assertNotNull(nextEvent.getCar());
        assertEquals(newEntity.getCar().getId(), nextEvent.getCar().getId());
    }

    @Test
    public void shouldRespectPermissions() throws Exception {

        String url = "/api/events/type/insurance/current/";
        //Not logged
        mvc.perform(get(url + othersUserCar.getId())).andExpect(status().isUnauthorized());
        //Trying to get car without access
        mvcOAuth2(get(url + othersUserCar.getId())).andExpect(status().isForbidden());
        //Get owned car insurance
        mvcOAuth2(get(url + toyota.getId())).andExpect(status().isOk());
    }
}
