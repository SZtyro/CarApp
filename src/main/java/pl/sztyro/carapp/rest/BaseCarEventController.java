package pl.sztyro.carapp.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.model.*;
import pl.sztyro.core.rest.BaseController;
import pl.sztyro.core.rest.FilteredResult;

import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.*;

public abstract class BaseCarEventController<T extends  CarEvent> extends BaseController<T> {

    static final Map<String, String> eventTypes = Map.of(
            RefuelEvent.class.getName(), "local_gas_station",
            TireChangeEvent.class.getName(), "tire_repair",
            InsuranceEvent.class.getName(), "security",
            RepairEvent.class.getName(),"car_repair",
            CarCareEvent.class.getName(),"soap"
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
                    latestEvent.setNextEvent(changes);
                    em.merge(latestEvent);
                }else{
                    if(results.size() == 2){
                        T previous = results.get(1);
                        changes.setPreviousEvent(previous);
                    }
                }
            }
        }
        if(changes.getNextEvent() == null){
            List<T> nextEvents = queryBuilder()
                    .dateFrom("date", String.valueOf(changes.getDate().getTime()))
                    .size(2)
                    .and("sort", "date:ASC")
                    .and("car.id", String.valueOf(changes.getCar().getId()))
                    .queryAll().getResults();
            if(nextEvents.size() == 2){
                if(nextEvents.get(0).getId().equals(changes.getId())){
                    T nextEvent = nextEvents.get(1);
                    changes.setNextEvent(nextEvent);
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
        root.fetch(CarEvent_.nextEvent, JoinType.LEFT);
    }

    @GetMapping("/types")
    public Map<String, String> getEventTypes(){
        return eventTypes;
    }

}
