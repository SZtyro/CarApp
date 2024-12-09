package pl.sztyro.carapp.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.model.TireChangeEvent;
import pl.sztyro.core.rest.BaseController;

import java.io.IOException;

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

    @Override
    public void beforeUpdateEntity(TireChangeEvent dbEntity, TireChangeEvent changes) throws IOException {
        if(changes.getCar() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Set car.");
        super.beforeUpdateEntity(dbEntity, changes);
    }

}
