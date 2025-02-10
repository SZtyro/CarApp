package pl.sztyro.carapp.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.model.RepairEvent;
import pl.sztyro.core.rest.BaseController;

import java.io.IOException;

@RestController
@RequestMapping("/api/events/type/repair")
public class RepairEventController extends BaseController<RepairEvent> {

    public RepairEventController(){
        super(RepairEventController.class, RepairEvent.class);
    }

    @Override
    public RepairEvent createEntity(RepairEvent init) {
        if(init != null) return init;
        return RepairEvent.builder().build();
    }

    @Override
    public void beforeUpdateEntity(RepairEvent dbEntity, RepairEvent changes) throws IOException {
        if(changes.getCar() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Set car.");
        super.beforeUpdateEntity(dbEntity, changes);
    }

}
