package pl.sztyro.carapp.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.model.CarEvent;
import pl.sztyro.core.rest.BaseController;
import pl.sztyro.core.rest.FilteredResult;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/events")
public class CarEventController extends BaseController<CarEvent> {

    public CarEventController(){
        super(CarEventController.class, CarEvent.class);
    }

    @Override
    public CarEvent createEntity(CarEvent init) {
        if(init == null)
            init = new CarEvent();
        return init;
    }

    @Override
    public void beforeUpdateEntity(CarEvent dbEntity, CarEvent changes) throws IOException {
        if(changes.getType() == null)
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Set event type."
            );
        if(changes.getCar() == null)
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Set car."
            );
        if(changes.getPreviousEvent() == null){
            HashMap<String, String> params = new HashMap<>();
            params.put("type", changes.getType().name());
            params.put("date:To", String.valueOf(changes.getDate().getTime()));
            params.put("size", "2");
            params.put("sort", "date:DESC");
            params.put("car.id", String.valueOf(changes.getCar().getId()));
            FilteredResult<CarEvent> all = this.getAll(params);
            List<CarEvent> results = all.getResults();
            if(!results.isEmpty()) {
                //Take 2 latest events, if user just saved second event then results
                //has only one last (first) elem
                CarEvent latestEvent = results.get(0);
                //Avoid reference to itself
                if(!Objects.equals(latestEvent.getId(), changes.getId())) {
                    changes.setPreviousEvent(latestEvent);
                    latestEvent.setNextEvent(changes);
                    update(latestEvent.getId(),latestEvent );
                }else{
                    if(results.size() == 2){
                        changes.setPreviousEvent(results.get(1));
                    }
                }
            }
        }

        super.beforeUpdateEntity(dbEntity, changes);
    }

    @Override
    public void afterUpdateEntity(CarEvent updatedEntity) throws IOException {
        Map<String, String> params = new HashMap<>();
        params.put("previousEvent.id", String.valueOf(updatedEntity.getId()));
        List<CarEvent> results = this.getAll(params).getResults();
        switch (updatedEntity.getType()){
            case Insurance, Inspection -> {
                //There is no next event (entity with parent id)
                if(results.isEmpty()){
                    CarEvent nextEvent = new CarEvent();
                    Date date = updatedEntity.getDate();
                    Calendar calendar = Calendar.getInstance();
                    calendar.setTime(date);
                    calendar.add(Calendar.YEAR, 1);
                    calendar.add(Calendar.DAY_OF_MONTH, -1);
                    nextEvent.setDraft(false);
                    nextEvent.setCar(updatedEntity.getCar());
                    nextEvent.setDate(calendar.getTime());
                    nextEvent.setType(updatedEntity.getType());
                    nextEvent.setPreviousEvent(this.repository.save(updatedEntity));

                    nextEvent = create(nextEvent).getBody();
                    updatedEntity.setNextEvent(nextEvent);
                    repository.save(updatedEntity);
                }
            }
        }
    }

}
