package pl.sztyro.carapp.rest;

import org.springframework.beans.factory.annotation.Autowired;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.repository.CarRepository;

public class BaseEventIntegrationTest extends BaseIntegrationTest{

    protected Car toyota;
    protected Car mercedes;

    @Autowired
    protected CarRepository cars;

    @Override
    public void init() {
        super.init();

        if(cars.count() == 0) {
            toyota = cars.save(Car.builder().name("Toyota").draft(false).author(getTester()).build());
            mercedes = cars.save(Car.builder().name("Mercedes").draft(false).build());
        }
    }
}
