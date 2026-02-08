package pl.sztyro.carapp.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.model.*;
import pl.sztyro.carapp.service.CarService;
import pl.sztyro.core.rest.BaseController;

import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;
import java.io.IOException;
import java.util.*;

public abstract class BaseCarEventController<T extends  CarEvent> extends BaseController<T> {

    @Autowired
    protected CarService cars;

    static final Map<String, String> eventTypes = Map.of(
            RefuelEvent.class.getName(), "local_gas_station",
            TireChangeEvent.class.getName(), "tire_repair",
            InsuranceEvent.class.getName(), "security",
            RepairEvent.class.getName(),"car_repair",
            CarCareEvent.class.getName(),"soap",
            ModificationEvent.class.getName(),"car_gear"
    );

    public BaseCarEventController(Class controllerClass, Class<T> entityClass){
        super(controllerClass, entityClass);
    }

    @Override
    public void beforeUpdateEntity(T dbEntity, T changes) {

        if(changes.getCar() == null)
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Set car."
            );
        if(changes.getPreviousEvent() == null && dbEntity.getPreviousEvent() == null){
            List<T> results = queryBuilder()
                    .size(2)
                    .dateTo("date", String.valueOf(changes.getDate().getTime()))
                    .sortDesc("date")
                    .and("car.id", String.valueOf(changes.getCar().getId()))
                    .queryAll(this::getFetch)
                    .getResults();

            if(!results.isEmpty()) {
                //Take 2 latest events, if user just saved second event then results
                //has only one last (first) elem
                T latestEvent = results.get(0);
                //Avoid reference to itself
                if(!Objects.equals(latestEvent.getId(), changes.getId())) {
                    changes.setPreviousEvent(latestEvent);
                    em.merge(latestEvent);
                }else{
                    if(results.size() == 2){
                        T previous = results.get(1);
                        changes.setPreviousEvent(previous);
                    }
                }
            }
        }

        super.beforeUpdateEntity(dbEntity, changes);
    }

    @Override
    protected void getAllFetch(Root<T> root) {
        root.fetch(CarEvent_.car, JoinType.LEFT);
    }

    @Override
    protected void getFetch(Root<T> root) {
        root.fetch(CarEvent_.car, JoinType.LEFT);
        root.fetch(CarEvent_.previousEvent, JoinType.LEFT);
    }

    @Override
    public ResponseEntity<T> create(T entity) throws IOException {
        List<Car> userCars = cars.getUserCars();
        if(userCars.size() == 1){
            entity.setCar(userCars.get(0));
        }
        return super.create(entity);
    }

    @GetMapping("/types")
    public Map<String, String> getEventTypes(){
        return eventTypes;
    }

}
