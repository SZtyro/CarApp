package pl.sztyro.carapp.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.InsuranceEvent;
import pl.sztyro.carapp.repository.InsuranceEventRepository;
import pl.sztyro.carapp.service.InsuranceService;
import pl.sztyro.core.service.UserService;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/events/type/insurance")
public class InsuranceEventController extends BaseCarEventController<InsuranceEvent> {

    @Autowired
    private UserService userService;

    @Autowired
    private InsuranceEventRepository repository;

    @Autowired
    private InsuranceService insuranceService;

    public InsuranceEventController(){
        super(InsuranceEventController.class, InsuranceEvent.class);
    }


    @Override
    public void afterUpdateEntity(InsuranceEvent updatedEntity) {
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

            Date date = updatedEntity.getDate();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.YEAR, 1);
            InsuranceEvent nextEvent = InsuranceEvent.builder()
                    .draft(false)
                    .author(userService.getCurrent())
                    .car(updatedEntity.getCar())
                    .date(calendar.getTime())
                    .previousEvent(this.repository.save(updatedEntity))
                    .build();

            try {
                nextEvent = create(nextEvent).getBody();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            updatedEntity.setNextEvent(nextEvent);
            repository.save(updatedEntity);

        }
    }

    @GetMapping("/current/{carId}")
    @PreAuthorize("@permissionService.hasPrivilege(#carId, T(pl.sztyro.carapp.model.Car), 'Read')")
    public InsuranceEvent getCurrentInsurance(@PathVariable("carId") Long carId){
        return insuranceService.getCurrentInsurance(carId);
    }


}
