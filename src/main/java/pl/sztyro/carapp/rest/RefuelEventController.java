package pl.sztyro.carapp.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.model.CarEvent;
import pl.sztyro.carapp.model.RefuelEvent;
import pl.sztyro.carapp.service.RefuelService;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/events/type/refuel")
public class RefuelEventController extends BaseCarEventController<RefuelEvent> {

    @Autowired
    private RefuelService refuelService;

    public RefuelEventController(){
        super(RefuelEventController.class, RefuelEvent.class);
    }

    @Override
    public void beforeUpdateEntity(RefuelEvent dbEntity, RefuelEvent changes) throws IOException {
        super.beforeUpdateEntity(dbEntity, changes);
        CarEvent previousEvent = changes.getPreviousEvent();

        if(previousEvent != null) {
            Integer latestRefuelMileage = Optional.ofNullable(previousEvent.getMileage()).orElse(0);
            Double consumption = ((100 * changes.getAmountOfFuel()) / (changes.getMileage() - latestRefuelMileage));
            Car car = changes.getCar();
            refuelService.assignConsumption(car, consumption);

            em.merge(car);
        }
    }


}
