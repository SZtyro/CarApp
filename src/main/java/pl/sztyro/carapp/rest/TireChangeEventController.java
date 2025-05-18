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
import pl.sztyro.core.model.BaseEntity;
import pl.sztyro.core.rest.FilteredResult;
import pl.sztyro.core.service.DateService;
import pl.sztyro.core.service.PermissionService;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.io.IOException;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/events/type/tireChange")
public class TireChangeEventController extends BaseCarEventController<TireChangeEvent> {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private TireService tireService;

    @Autowired
    private RefuelEventController refuelEventController;

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private DateService dateService;

    public TireChangeEventController(){
        super(TireChangeEventController.class, TireChangeEvent.class);
    }

    @Override
    protected void getFetch(Root<TireChangeEvent> root) {
        root.fetch(TireChangeEvent_.car, JoinType.LEFT);
        root.fetch(TireChangeEvent_.tires, JoinType.LEFT);
        root.fetch(TireChangeEvent_.nextEvent, JoinType.LEFT);
        root.fetch(TireChangeEvent_.previousEvent, JoinType.LEFT);
    }

    @GetMapping("/summary/{id}")
    public CarTiresSummary getTiresSummary(@PathVariable("id") Long carId) throws IOException {

        Optional<Car> car = carRepository.findById(carId);

        if(car.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Document not found.");

        if(permissionService.hasPrivilege(car.get(), PermissionType.Read)) {

            List<TireChangeEvent> results = getLastTireChanges(carId);

            if(!results.isEmpty()) {
                TireChangeEvent lastChange = results.get(0);
                FilteredResult<RefuelEvent> lastRefueling = refuelEventController.queryBuilder()
                        .and("car.id", String.valueOf(carId))
                        .dateFrom("date", lastChange.getDate())
                        .size(1)
                        .queryAllIgnorePermissions();

                int fromLastChangeToLastEvent = 0;
                if (!lastRefueling.getResults().isEmpty())
                    fromLastChangeToLastEvent = Math.abs(
                            Optional.ofNullable(lastRefueling.getResults().get(0).getMileage()).orElse(0) -
                            Optional.ofNullable(lastChange.getMileage()).orElse(0)
                    );

                Set<Tire> currentTires = lastChange.getTires();
                Set<Long> currentTiresIds = currentTires.stream().map(BaseEntity::getId).collect(Collectors.toSet());

                List<TireChangeEvent> previousChanges = queryBuilder()
                        .and("car.id", String.valueOf(carId))
                        .sortAsc("mileage")
                        .queryAll(root -> {
                            root.fetch(TireChangeEvent_.nextEvent, JoinType.LEFT);
                            root.fetch(TireChangeEvent_.tires, JoinType.LEFT);
                        })
                        .getResults();

                int mileage = fromLastChangeToLastEvent;


                for (TireChangeEvent change : previousChanges) {
                    Set<Long> changeTireIds = change.getTires().stream().map(BaseEntity::getId).collect(Collectors.toSet());
                    if(changeTireIds.equals(currentTiresIds)){
                        if(change.getNextEvent() != null) mileage = mileage + change.getNextEvent().getMileage();
                    }
                }


                return CarTiresSummary.builder()
                        .age(tireService.getTiresAge(currentTires))
                        .type(tireService.getTiresType(currentTires))
                        .mileage(String.valueOf(mileage))
                        .events(results)
                        .build();
            }
            return null;


        }else throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No access");

    }

    private List<TireChangeEvent> getLastTireChanges(long carId) throws IOException {
        return queryBuilder()
            .and("car.id", String.valueOf(carId))
            .dateFrom("date", dateService.builder().add(Calendar.YEAR, -1).build())
            .dateTo("date", dateService.now())
            .queryAll((Root<TireChangeEvent> root) -> {
                root.fetch(TireChangeEvent_.tires, JoinType.LEFT).fetch(Tire_.model, JoinType.LEFT);
            })
            .getResults();
    }

    private List<TireChangeEvent> getAllChangesForTires(Set<Tire> tires) throws IOException {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<TireChangeEvent> query = cb.createQuery(TireChangeEvent.class);
        Root<TireChangeEvent> from = query.from(TireChangeEvent.class);
        @SuppressWarnings("unchecked")
        Join<TireChangeEvent, Tire> fTires = (Join<TireChangeEvent, Tire>) from.fetch(TireChangeEvent_.tires, JoinType.LEFT);

        query.where(fTires.in(tires));
        query.orderBy(cb.desc(from.get(TireChangeEvent_.mileage)));

        TypedQuery<TireChangeEvent> typedQuery = em.createQuery(query);

        return typedQuery.getResultList();

    }

    @Builder
    @Getter
    public static class CarTiresSummary{
        private TireType type;
        private String mileage,age;
        private List<TireChangeEvent> events;

    }
}
