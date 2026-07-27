package pl.sztyro.carapp.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.service.CarEventService;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final CarEventService eventService;

    @PreAuthorize("@permissionService.hasPrivilege(#carId, T(pl.sztyro.carapp.model.Car), 'Read')")
    @GetMapping("/summary/{year}/{carId}")
    public CarEventService.CarEventSummary getSummary(@PathVariable Long carId, @PathVariable("year") Integer year){
            return eventService.getSummary(carId, year);
    }

    @PreAuthorize("@permissionService.hasPrivilege(#carId, T(pl.sztyro.carapp.model.Car), 'Read')")
    @GetMapping("/stored-years/{carId}")
    public List<Integer> getStoredCarYears(@PathVariable Long carId){
            return eventService.getStoredYears(carId);
    }
}
