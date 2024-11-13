package pl.sztyro.carapp.repository;

import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.core.interfaces.BaseRepository;

@Repository
public interface CarRepository extends BaseRepository<Car> {

    Car findOneByName(String name);
}
