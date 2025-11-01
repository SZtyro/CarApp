package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.ModificationEvent;

@RestController
@RequestMapping("/api/events/type/modification")
public class ModificationEventController extends BaseCarEventController<ModificationEvent> {

    public ModificationEventController(){
        super(ModificationEventController.class, ModificationEvent.class);
    }

}
