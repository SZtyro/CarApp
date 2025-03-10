package pl.sztyro.carapp.rest;

import org.assertj.core.util.Lists;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.web.WebAppConfiguration;
import pl.sztyro.carapp.enums.TirePlacement;
import pl.sztyro.carapp.enums.TireType;
import pl.sztyro.carapp.model.*;
import pl.sztyro.carapp.repository.*;
import pl.sztyro.core.service.DateService;
import pl.sztyro.core.service.UserService;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;

@SpringBootTest
@AutoConfigureMockMvc
@WebAppConfiguration
@ActiveProfiles({"test"})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class TireChangeEventControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private TireChangeEventController controller;

    @Autowired
    private TireChangeEventRepository repository;

    @Autowired
    private RefuelEventRepository refuelEventRepository;

    @Autowired
    private TireCompanyRepository companies;

    @Autowired
    private TireModelRepository modelRepository;

    @Autowired
    private TireModelController tireModelController;

    @Autowired
    private TireController tireController;

    @Autowired
    private UserService userService;

    @Autowired
    private CarRepository carRepository;

    @SpyBean
    private DateService dateService;

    @Override
    @BeforeAll
    public void init(){
        super.init();

        TireCompany michelin = companies.save(TireCompany.builder()
                .name("Michelin")
                .logoUrl("michelinLogo")
                .build()
        );
        TireCompany pirelli = companies.save(TireCompany.builder()
                .name("Pirelli")
                .logoUrl("pirelliLogo")
                .build()
        );

        carRepository.save(Car.builder().name("Toyota").author(getTester()).build());

    }

    @BeforeEach
    public void setUp(){
        super.setUp();

    }

    @Test
    public void shouldAttachPreviousAndNextEvent() throws IOException {
        Car toyota = carRepository.findOneByName("Toyota");
        TireChangeEvent firstChange = controller.create(
                TireChangeEvent.builder()
                        .car(toyota)
                        .date(dateService.from(2023, 1, 10))
                        .build()
        ).getBody();

        firstChange.setMileage(123);
        controller.update(firstChange.getId(), firstChange);

        TireChangeEvent secondChange = controller.create(
                TireChangeEvent.builder()
                        .car(toyota)
                        .date(dateService.from(2023, 10, 20))
                        .build()
        ).getBody();

        secondChange.setMileage(234);
        secondChange = controller.update(secondChange.getId(), secondChange);
        firstChange = controller.get(firstChange.getId()).getBody();

        assertEquals(firstChange.getId(), secondChange.getPreviousEvent().getId());
        assertEquals(secondChange.getId(), firstChange.getNextEvent().getId());
    }

    @Test
    public void shouldReturnStandardTireSummary() throws IOException {

        doReturn(dateService.from(2024, 4, 10)).when(dateService).now();

        Car toyota = carRepository.findOneByName("Toyota");
        TireModel pilot = tireModelController.create(TireModel.builder().name("Pilot sport 5").type(TireType.Summer).build()).getBody();
        TireModel sottozero = tireModelController.create(TireModel.builder().name("Winter Sottozero 3").type(TireType.Winter).build()).getBody();

        Set<Tire> summerSet = createTiresFor(pilot);
        Set<Tire> winterSet = createTiresFor(sottozero);

        TireChangeEvent firstChange = controller.create(TireChangeEvent.builder()
                .mileage(0)
                .tires(summerSet)
                .car(toyota)
                .date(dateService.from(2023, 1,1))
                .build()).getBody();
        controller.update(firstChange.getId(),firstChange);

        TireChangeEvent secondChange = controller.create(TireChangeEvent.builder()
                .mileage(500)
                .tires(winterSet)
                .car(toyota)
                .date(dateService.from(2023, 10, 1))
                .build()
        ).getBody();
        controller.update(secondChange.getId(), secondChange);

        TireChangeEvent thirdChange = controller.create(TireChangeEvent.builder()
                .mileage(1000)
                .tires(summerSet)
                .car(toyota)
                .date(dateService.from(2024, 3, 1))
                .build()
        ).getBody();
        controller.update(thirdChange.getId(), thirdChange);

        Date eventDate = dateService.from(2023, 1, 10);
        int milage = 0;
        for (int i = 0; i < 16; i++) {
            milage += 100;
            refuelEventRepository.save(RefuelEvent.builder()
                    .mileage(milage)
                    .date(eventDate)
                    .draft(false)
                    .car(toyota)
                    .build()
            );
            eventDate = dateService.builder()
                    .init(eventDate)
                    .add(Calendar.MONTH, 1)
                    .build();
        }

        TireChangeEventController.CarTiresSummary summary = controller.getTiresSummary(toyota.getId());
        assertEquals(TireType.Summer, summary.getType());
        assertEquals("1.9", summary.getAge());
        //First change at 500 mileage, second at 1000. Last event mileage 1600
        assertEquals("1100", summary.getMileage());
    }

    private Set<Tire> createTiresFor(TireModel model) throws IOException {
        HashSet<Tire> tires = new HashSet<>();
        for (TirePlacement tirePlacement : Lists.list(TirePlacement.RR, TirePlacement.LR, TirePlacement.LF, TirePlacement.RF)) {
            tires.add(
                    tireController.create(Tire.builder()
                            .model(model)
                            .date(dateService.from(2022, 5, 10))
                            .placement(tirePlacement)
                            .build()
                    ).getBody()
            );
        }
        return tires;
    }


}