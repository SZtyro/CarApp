package pl.sztyro.carapp.service;

import com.sun.istack.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.repository.CarRepository;
import pl.sztyro.core.enums.PermissionType;
import pl.sztyro.core.service.PermissionService;

import javax.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository repository;
    private final PermissionService permissionService;

    public Car getCar(@NotNull Long carId) throws AccessDeniedException, EntityNotFoundException{
        Car car = repository.findById(carId).orElseThrow(EntityNotFoundException::new);
        if(permissionService.hasPrivilege(car, PermissionType.Read)) return car;
        throw new AccessDeniedException("User has no access to car " + car.getId());
    }

}
