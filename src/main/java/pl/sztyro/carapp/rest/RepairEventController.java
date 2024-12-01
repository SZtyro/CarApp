package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.RepairEvent;
import pl.sztyro.core.rest.BaseController;

@RestController
@RequestMapping("/api/events/type/repair")
public class RepairEventController extends BaseController<RepairEvent> {

    public RepairEventController(){
        super(RepairEventController.class, RepairEvent.class);
    }

    @Override
    public RepairEvent createEntity(RepairEvent init) {
        if(init != null) return init;
        return new RepairEvent();
    }
}
