package pl.sztyro.carapp.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import pl.sztyro.carapp.model.Car;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest()
@ActiveProfiles({"test"})
class RefuelServiceUnitTest {

    @Autowired
    private RefuelService refuelService;

    @Test
    public void shouldAssignConsumption(){
        Car car = new Car();

        car = refuelService.assignConsumption(car,5.5);
        assertEquals(5.5, (double) car.getLowestConsumption() );

        car = refuelService.assignConsumption(car,5.7);
        assertEquals( 5.5, (double) car.getLowestConsumption());
        assertEquals( 5.7, (double) car.getHighestConsumption());

        car = refuelService.assignConsumption(car,5.8);
        assertEquals( 5.5, (double) car.getLowestConsumption());
        assertEquals( 5.8, (double) car.getHighestConsumption());

        car = refuelService.assignConsumption(car,5.65);
        assertEquals( 5.5, (double) car.getLowestConsumption());
        assertEquals( 5.8, (double) car.getHighestConsumption());

        car = refuelService.assignConsumption(car,5.4);
        assertEquals( 5.4, (double) car.getLowestConsumption());
        assertEquals( 5.8, (double) car.getHighestConsumption());

        car.setLowestConsumption(null);
        car.setHighestConsumption(null);

        car = refuelService.assignConsumption(car,5.5);
        assertEquals(5.5, (double) car.getLowestConsumption() );

        car = refuelService.assignConsumption(car,5.2);
        assertEquals(5.2, (double) car.getLowestConsumption());
        assertEquals(5.5, (double) car.getHighestConsumption());

    }

}