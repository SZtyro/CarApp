package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.RepairEvent;

@RestController
@RequestMapping("/api/events/type/repair")
public class RepairEventController extends BaseCarEventController<RepairEvent> {

    public RepairEventController(){
        super(RepairEventController.class, RepairEvent.class);
    }

}
