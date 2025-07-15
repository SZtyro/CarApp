package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.CarCareEvent;
import pl.sztyro.core.rest.BaseController;

@RequestMapping("/api/events/type/carCare")
@RestController
public class CarCareEventController extends BaseCarEventController<CarCareEvent> {

    public CarCareEventController() {
        super(CarCareEventController.class, CarCareEvent.class);
    }
}
