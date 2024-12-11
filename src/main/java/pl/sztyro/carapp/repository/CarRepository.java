package pl.sztyro.carapp.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.core.interfaces.BaseRepository;

import java.util.Optional;

@Repository
public interface CarRepository extends BaseRepository<Car> {

    @EntityGraph(
            attributePaths = {"author", "access"}
    )
    @Override
    Optional<Car> findById(Long aLong);

    Car findOneByName(String name);
}
