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
import java.util.*;

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
        TireModel pilotAlpin = modelRepository.save(TireModel.builder()
                .company(michelin)
                .name("Pilot alpin 5")
                .type(TireType.Winter)
                .build()
        );
        TireModel pilotSport = modelRepository.save(TireModel.builder()
                .company(michelin)
                .name("Pilot sport 5")
                .type(TireType.Summer)
                .build()
        );
        TireModel winterSottozero = modelRepository.save(TireModel.builder()
                .company(pirelli)
                .name("Winter Sottozero 3")
                .type(TireType.Winter)
                .build()
        );

        carRepository.save(Car.builder().name("Toyota").author(getTester()).build());

    }

    @BeforeEach
    public void setUp(){
        super.setUp();

    }

    @Test
    public void shouldReturnStandardTireSummary() throws IOException {

        doReturn(dateService.from(2024, 4, 10)).when(dateService).now();

        Car toyota = carRepository.findOneByName("Toyota");
        controller.create(createEventFor(
                "Pilot sport 5",
                toyota,
                new Calendar.Builder().setDate(2023,3, 25).build().getTime(),
                0
        ));
        controller.create(createEventFor(
                "Winter Sottozero 3",
                toyota,
                new Calendar.Builder().setDate(2023,10, 1).build().getTime(),
                500
        ));
        controller.create(createEventFor(
                "Pilot sport 5",
                toyota,
                new Calendar.Builder().setDate(2024,4, 1).build().getTime(),
                1000
        ));

        Date eventDate = dateService.from(2023, 8, 10);
        int milage = 0;
        for (int i = 0; i < 12; i++) {
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
        assertEquals("1200", summary.getMileage());
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

    private TireChangeEvent createEventFor(String modelName, Car car, Date date, int mileage ) throws IOException {
        return TireChangeEvent.builder()
                .tires(createTiresFor(modelRepository.findByName(modelName)))
                .car(car)
                .date(date)
                .mileage(mileage)
                .build();
    }
}