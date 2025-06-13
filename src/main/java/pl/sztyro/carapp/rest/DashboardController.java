package pl.sztyro.carapp.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.service.CarEventService;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final CarEventService eventService;

    @PreAuthorize("@permissionService.hasPrivilege(#carId, T(pl.sztyro.carapp.model.Car), 'Read')")
    @GetMapping("/summary/{carId}")
    public CarEventService.CarEventSummary getSummary(@PathVariable Long carId){
            return eventService.getSummary(carId);
    }
}
