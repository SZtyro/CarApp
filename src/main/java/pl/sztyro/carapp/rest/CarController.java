package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.core.rest.BaseController;

@RestController
@RequestMapping("/api/cars")
public class CarController extends BaseController<Car> {

    public CarController() {
        super(CarController.class, Car.class);
    }

    @Override
    public Car createEntity(Car init) {
        if(init == null){
            init = Car.builder().build();
        }
        return init;
    }



}
