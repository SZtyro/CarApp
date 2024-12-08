package pl.sztyro.carapp.rest;

import org.springframework.beans.factory.annotation.Autowired;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.repository.CarRepository;

public class BaseEventIntegrationTest extends BaseIntegrationTest{

    @Autowired
    protected CarRepository cars;

    @Override
    public void init() {
        super.init();

        if(cars.count() == 0) {
            Car toyota = new Car();
            toyota.setName("Toyota");
            toyota.setDraft(false);
            cars.save(toyota);

            Car mercedes = new Car();
            mercedes.setName("Mercedes");
            mercedes.setDraft(false);
            cars.save(mercedes);
        }
    }
}
