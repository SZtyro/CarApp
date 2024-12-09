package pl.sztyro.carapp.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.CarEvent;
import pl.sztyro.core.interfaces.BaseRepository;

import java.util.Optional;

@Repository
public interface CarEventRepository extends BaseRepository<CarEvent> {
    @EntityGraph(attributePaths = {"car", "nextEvent", "previousEvent"})
    @Override
    Optional<CarEvent> findById(Long aLong);
}
