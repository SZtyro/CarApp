package pl.sztyro.carapp.rest;

import lombok.Builder;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.sztyro.carapp.enums.TireType;
import pl.sztyro.carapp.model.*;
import pl.sztyro.carapp.repository.CarRepository;
import pl.sztyro.carapp.service.TireService;
import pl.sztyro.core.enums.PermissionType;
import pl.sztyro.core.rest.BaseController;
import pl.sztyro.core.rest.FilteredResult;

import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;
import java.io.IOException;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.Set;


@RestController
@RequestMapping("/api/events/type/tireChange")
public class TireChangeEventController extends BaseController<TireChangeEvent> {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private TireService tireService;

    @Autowired
    private RefuelEventController refuelEventController;

    public TireChangeEventController(){
        super(TireChangeEventController.class, TireChangeEvent.class);
    }

    @Override
    public TireChangeEvent createEntity(TireChangeEvent init) {
        if(init != null) return init;
        return TireChangeEvent.builder().build();
    }

    @Override
    public void beforeUpdateEntity(TireChangeEvent dbEntity, TireChangeEvent changes) throws IOException {
        if(changes.getCar() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Set car.");
        super.beforeUpdateEntity(dbEntity, changes);
    }

    @GetMapping("/summary/{id}")
    public CarTiresSummary getTiresSummary(@PathVariable("id") Long carId) throws IOException {

        Optional<Car> car = carRepository.findById(carId);

        if(car.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Document not found.");

        if(permissionService.hasPrivilege(car.get(), PermissionType.Read)) {

            List<TireChangeEvent> results = queryBuilder()
                    .and("car.id", String.valueOf(carId))
                    .dateFrom("date", dateService.builder().add(Calendar.YEAR, -1).build())
                    .dateTo("date", dateService.now())
                    .queryAll((Root<TireChangeEvent> root) -> {
                        root.fetch(TireChangeEvent_.tires, JoinType.LEFT).fetch(Tire_.model, JoinType.LEFT);
                    })
                    .getResults();

            if(!results.isEmpty()) {
                TireChangeEvent lastChange = results.get(0);
                FilteredResult<RefuelEvent> latestEvent = refuelEventController.queryBuilder()
                        .and("car.id", String.valueOf(carId))
                        .dateFrom("date", lastChange.getDate())
                        .size(1)
                        .queryAllIgnorePermissions();
                String tiresMileage = String.valueOf(lastChange.getMileage());
                if (!latestEvent.getResults().isEmpty())
                    tiresMileage = String.valueOf(latestEvent.getResults().get(0).getMileage());

                //Current tires
                Set<Tire> tires = lastChange.getTires();

                return CarTiresSummary.builder()
                        .age(tireService.getTiresAge(tires))
                        .type(tireService.getTiresType(tires))
                        .mileage(tiresMileage)
                        .build();
            }
            return null;


        }else throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No access");

    }

    @Builder
    @Getter
    public static class CarTiresSummary{
        private TireType type;
        private String mileage,age;
        private Set<Object> tireSets;

    }
}
