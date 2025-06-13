package pl.sztyro.carapp.service;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.stereotype.Service;
import pl.sztyro.carapp.model.CarEvent;
import pl.sztyro.carapp.repository.CarEventRepository;
import pl.sztyro.core.Utils;
import pl.sztyro.core.service.DateService;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CarEventService {

    private final CarEventRepository repository;
    private final DateService dateService;

    public CarEventSummary getSummary(Long carId) {

        int year = Utils.Date.extract(Calendar.YEAR, dateService.now());
        List<CarEvent> eventsThisYear = repository.findAllByCarIdAndDateGreaterThan(carId, Utils.Date.from(year, 1, 1));


        CarEventSummary summary = new CarEventSummary();
        eventsThisYear.forEach(event -> {
            String month = Utils.Date.indexToMonth(Utils.Date.extract(Calendar.MONTH, event.getDate()) + 1).toLowerCase();
            List<CarEventSummaryDetails> existing = new ArrayList<>();
            List<CarEventSummaryDetails> byMonth = summary.getByMonth(month);
            if(byMonth != null) existing.addAll(byMonth);

            Optional<CarEventSummaryDetails> type = existing.stream()
                    .filter(e -> event.getEntityType().equals(e.type))
                    .findFirst();

            if(type.isPresent())
                type.get().add(event.getPrice());
            else{
                existing.add(CarEventSummaryDetails.builder().sum(event.getPrice()).type(event.getEntityType()).build());
            }
            summary.setByMonth(month, existing);
        });

        return summary;
    }

    public static class CarEventSummary extends Utils.Statistics.Yearly<List<CarEventSummaryDetails>> {
    }

    @Getter
    @Setter
    @SuperBuilder(toBuilder = true)
    @NoArgsConstructor
    public static class CarEventSummaryDetails {
        private Double sum;
        private String type;

        public Double add(Double addition){
            if(addition == null) addition = 0.0;
            if(this.sum == null) {
                this.sum = addition;
                return addition;
            }
            return this.sum += addition;
        }
    }
}
