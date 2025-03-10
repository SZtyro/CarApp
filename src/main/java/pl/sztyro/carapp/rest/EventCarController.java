package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.CarEvent;

@RestController
@RequestMapping("/api/events")
public class EventCarController extends BaseCarEventController<CarEvent> {

    public EventCarController() {
        super(EventCarController.class, CarEvent.class);
    }
}
