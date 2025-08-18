package pl.sztyro.carapp.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.CarEvent;
import pl.sztyro.core.interfaces.BaseRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarEventRepository extends BaseRepository<CarEvent> {
    @EntityGraph(attributePaths = {"car", "previousEvent"})
    @Override
    Optional<CarEvent> findById(Long aLong);

    List<CarEvent> findAllByCarIdAndDateGreaterThan(Long carId, Date greaterThan);
}
