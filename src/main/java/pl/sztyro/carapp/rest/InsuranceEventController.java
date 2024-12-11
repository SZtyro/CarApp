package pl.sztyro.carapp.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.model.InsuranceEvent;
import pl.sztyro.core.rest.BaseController;
import pl.sztyro.core.service.UserService;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/events/type/insurance")
public class InsuranceEventController extends BaseController<InsuranceEvent> {

    @Autowired
    private UserService userService;

    public InsuranceEventController(){
        super(InsuranceEventController.class, InsuranceEvent.class);
    }

    @Override
    public InsuranceEvent createEntity(InsuranceEvent init) {
        if(init != null) return init;
        return new InsuranceEvent();
    }

    @Override
    public void beforeUpdateEntity(InsuranceEvent dbEntity, InsuranceEvent changes) throws IOException {
        if(changes.getCar() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Set car.");
        super.beforeUpdateEntity(dbEntity, changes);
    }

    @Override
    public void afterUpdateEntity(InsuranceEvent updatedEntity) throws IOException {
        Map<String, String> params = new HashMap<>();
        params.put("previousEvent.id", String.valueOf(updatedEntity.getId()));
        List<InsuranceEvent> results = this.getAll(params).getResults();
        Calendar c = Calendar.getInstance();
        int currentYear = c.get(Calendar.YEAR);
        c.setTime(updatedEntity.getDate());
        boolean shouldGenerate = currentYear - c.get(Calendar.YEAR) == 0;

        //There is no next event (entity with parent id)
        //Prevent generate next events for future years
        if (results.isEmpty() && shouldGenerate) {
            InsuranceEvent nextEvent = new InsuranceEvent();
            Date date = updatedEntity.getDate();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.YEAR, 1);
            calendar.add(Calendar.DAY_OF_MONTH, -1);
            nextEvent.setDraft(false);
            nextEvent.setAuthor(userService.getCurrent());
            nextEvent.setCar(updatedEntity.getCar());
            nextEvent.setDate(calendar.getTime());
            nextEvent.setPreviousEvent(this.repository.save(updatedEntity));

            nextEvent = create(nextEvent).getBody();
            updatedEntity.setNextEvent(nextEvent);
            repository.save(updatedEntity);

        }
    }


}
