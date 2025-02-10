package pl.sztyro.carapp.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.model.RefuelEvent;
import pl.sztyro.core.rest.BaseController;

import java.io.IOException;

@RestController
@RequestMapping("/api/events/type/refuel")
public class RefuelEventController extends BaseController<RefuelEvent> {

    public RefuelEventController(){
        super(RefuelEventController.class, RefuelEvent.class);
    }

    @Override
    public RefuelEvent createEntity(RefuelEvent init) {
        if(init != null) return init;
        return RefuelEvent.builder().build();
    }

    @Override
    public void beforeUpdateEntity(RefuelEvent dbEntity, RefuelEvent changes) throws IOException {
        if(changes.getCar() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Set car.");
        super.beforeUpdateEntity(dbEntity, changes);
    }

}
