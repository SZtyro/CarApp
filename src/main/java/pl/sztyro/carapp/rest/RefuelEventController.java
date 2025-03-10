package pl.sztyro.carapp.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.model.RefuelEvent;
import pl.sztyro.carapp.service.RefuelService;

import java.io.IOException;

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
        Integer latestRefuelMileage = changes.getPreviousEvent().getMileage();
        if(latestRefuelMileage != null) {
            Double consumption = ((100 * changes.getAmountOfFuel()) / (changes.getMileage() - latestRefuelMileage));
            Car car = changes.getCar();
            refuelService.assignConsumption(car, consumption);

            em.merge(car);
        }
    }


}
