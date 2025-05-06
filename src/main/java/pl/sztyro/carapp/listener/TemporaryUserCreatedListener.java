package pl.sztyro.carapp.listener;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import pl.sztyro.carapp.enums.EngineType;
import pl.sztyro.carapp.enums.TirePlacement;
import pl.sztyro.carapp.enums.TireType;
import pl.sztyro.carapp.model.*;
import pl.sztyro.carapp.repository.TireModelRepository;
import pl.sztyro.carapp.rest.InsuranceCompanyController;
import pl.sztyro.carapp.rest.InsuranceEventController;
import pl.sztyro.carapp.rest.RefuelEventController;
import pl.sztyro.core.event.TemporaryUserCreatedEvent;
import pl.sztyro.core.model.User;
import pl.sztyro.core.service.DateService;

import javax.persistence.EntityManager;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Component
public class TemporaryUserCreatedListener {

    @Autowired
    EntityManager em;

    @Autowired
    TireModelRepository tireModels;

    @Autowired
    InsuranceCompanyController insuranceCompanyController;

    @Autowired
    InsuranceEventController insuranceEventController;

    @Autowired
    RefuelEventController refuelEventController;

    @Autowired
    DateService dateService;

    @Transactional
    @EventListener
    public void onTemporaryUserCreated(TemporaryUserCreatedEvent event) throws IOException {

        User tempUser = event.getUser();

        Car multipla = em.merge(Car.builder()
                .name("Multipla")
                .engineType(EngineType.Diesel)
                .author(tempUser)
                .draft(false)
                .build()
        );

        Car vugattiBeyron = em.merge(Car.builder()
                .name("Vugatti Beyron")
                .engineType(EngineType.Petrol)
                .author(tempUser)
                .draft(false)
                .build()
        );

        em.merge(RepairEvent.builder()
                .car(multipla)
                .author(tempUser)
                .draft(false)
                .date(dateService.builder().add(Calendar.DATE, 10).build())
                .build()
        );
        em.merge(RepairEvent.builder()
                .car(vugattiBeyron)
                .author(tempUser)
                .draft(false)
                .date(dateService.builder().add(Calendar.DATE, 14).build())
                .build()
        );

        TireModel summerModel = tireModels.findFirstByType(TireType.Summer);
        TireModel winterModel = tireModels.findFirstByType(TireType.Winter);

        List<InsuranceCompany> insuranceCompanies = insuranceCompanyController.queryBuilder()
                .size(1)
                .queryAllIgnorePermissions()
                .getResults();


        if(summerModel == null || winterModel == null){
            log.info("There is no tire models which can be used for temporary user.");
        }else{
            Collection<TirePlacement> placements = Arrays.asList(TirePlacement.LF, TirePlacement.LR, TirePlacement.RF, TirePlacement.RR);
            //Get current month. Required for more realistic summary data.
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(dateService.now());
            int currentMonth = calendar.get(Calendar.MONTH);

            Arrays.asList(multipla, vugattiBeyron).forEach(car -> {

                if(!insuranceCompanies.isEmpty()) {
                    try {
                        InsuranceEvent in = insuranceEventController.create(InsuranceEvent.builder()
                                .car(car)
                                .date(new Date())
                                .draft(false)
                                .author(tempUser)
                                .company(insuranceCompanies.get(0))
                                .build()
                        ).getBody();
                        insuranceEventController.update(in.getId(), in);
                    } catch (IOException e) {
                        log.error("Cannot create insurance event for temporary user.", e);
                    }
                }else{
                    log.info("There is no insurance companies which can be used for temporary user.");
                }

                for (int mileage : Arrays.asList(1000, 1600, 2400)){
                    try {
                        RefuelEvent refuelEvent = refuelEventController.create(RefuelEvent.builder()
                                .author(tempUser)
                                .car(car)
                                .draft(false)
                                .date(dateService.builder()
                                        .add(Calendar.MONTH, -1)
                                        .add(Calendar.DAY_OF_MONTH, mileage/100)
                                        .build()
                                )
                                .build()).getBody();
                        refuelEvent.setMileage(mileage);
                        refuelEvent.setAmountOfFuel(25.0 + mileage/1000);
                        refuelEventController.update(refuelEvent.getId(), refuelEvent);
                    } catch (IOException e) {
                        log.info("There is a problem creating refuel event for temporary user.", e);
                    }
                }

                List<Tire> userTires = new ArrayList<>();
                for (TireModel model : Arrays.asList(summerModel, winterModel)) {
                    for (TirePlacement placement : placements) {
                        userTires.add(em.merge(Tire.builder()
                                .date(dateService.builder().add(Calendar.YEAR, -1).build())
                                .model(model)
                                .draft(false)
                                .author(tempUser)
                                .placement(placement)
                                .build()
                        ));
                    }
                }

                Set<Tire> summerSet = userTires.stream()
                        .filter(tire -> TireType.Summer.equals(tire.getModel().getType()))
                        .collect(Collectors.toSet());

                Set<Tire> winterSet = userTires.stream()
                        .filter(tire -> TireType.Winter.equals(tire.getModel().getType()))
                        .collect(Collectors.toSet());


                List<Date> winterChangeDates = new ArrayList<>();
                List<Date> summerChangeDates = new ArrayList<>();

                //All changes this year
                if (currentMonth > 10) {
                    winterChangeDates.add(dateService.builder().add(Calendar.YEAR, -1).set(Calendar.MONTH, 11).build());
                    summerChangeDates.add(dateService.builder().set(Calendar.MONTH, 4).build());
                    winterChangeDates.add(dateService.builder().set(Calendar.MONTH, 10).build());

                } else if (currentMonth > 3) {
                    summerChangeDates.add(dateService.builder().set(Calendar.MONTH, 3).build());
                    winterChangeDates.add(dateService.builder().add(Calendar.YEAR, -1).set(Calendar.MONTH, 11).build());
                    summerChangeDates.add(dateService.builder().add(Calendar.YEAR, -1).set(Calendar.MONTH, 4).set(Calendar.DATE, 4).build());
                } else {
                    winterChangeDates.add(dateService.builder().add(Calendar.YEAR, -1).set(Calendar.MONTH, 11).build());
                    summerChangeDates.add(dateService.builder().add(Calendar.YEAR, -1).set(Calendar.MONTH, 4).build());
                    winterChangeDates.add(dateService.builder().add(Calendar.YEAR, -1).set(Calendar.MONTH, 10).build());
                }


                winterChangeDates.forEach(date -> em.merge(TireChangeEvent.builder()
                        .tires(winterSet)
                        .car(car)
                        .draft(false)
                        .author(tempUser)
                        .date(date)
                        .build()
                ));

                summerChangeDates.forEach(date -> em.merge(TireChangeEvent.builder()
                        .tires(summerSet)
                        .car(car)
                        .draft(false)
                        .author(tempUser)
                        .date(date)
                        .build()
                ));
            });





        }

        em.merge(TireChangeEvent.builder()
                .car(vugattiBeyron)
                .author(tempUser)
                .draft(false)
                .date(dateService.builder().add(Calendar.DATE, 16).build())
                .build()
        );

    }
}
