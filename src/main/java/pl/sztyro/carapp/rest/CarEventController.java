package pl.sztyro.carapp.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.model.*;
import pl.sztyro.core.rest.BaseController;
import pl.sztyro.core.rest.FilteredResult;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/events")
public class CarEventController extends BaseController<CarEvent> {

    static final Map<String, String> eventTypes = Map.of(
            RefuelEvent.class.getName(), "local_gas_station",
            TireChangeEvent.class.getName(), "tire_repair",
            InsuranceEvent.class.getName(), "security",
            RepairEvent.class.getName(),"car_repair"
    );

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

        if(changes.getCar() == null)
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Set car."
            );
        if(changes.getPreviousEvent() == null){
            HashMap<String, String> params = new HashMap<>();
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

    @GetMapping("/types")
    public Map<String, String> getEventTypes(){
        return CarEventController.eventTypes;
    }

}
