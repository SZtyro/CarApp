package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.RefuelEvent;
import pl.sztyro.core.rest.BaseController;

@RestController
@RequestMapping("/api/events/type/refuel")
public class RefuelEventController extends BaseController<RefuelEvent> {

    public RefuelEventController(){
        super(RefuelEventController.class, RefuelEvent.class);
    }

    @Override
    public RefuelEvent createEntity(RefuelEvent init) {
        if(init != null) return init;
        return new RefuelEvent();
    }
}
