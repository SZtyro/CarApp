package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.TireChangeEvent;
import pl.sztyro.core.rest.BaseController;

@RestController
@RequestMapping("/api/events/type/tireChange")
public class TireChangeEventController extends BaseController<TireChangeEvent> {

    public TireChangeEventController(){
        super(TireChangeEventController.class, TireChangeEvent.class);
    }

    @Override
    public TireChangeEvent createEntity(TireChangeEvent init) {
        if(init != null) return init;
        return new TireChangeEvent();
    }
}
