package pl.sztyro.carapp.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.TireChangeEvent;
import pl.sztyro.core.interfaces.BaseRepository;

import java.util.Optional;

@Repository
public interface TireChangeEventRepository extends BaseRepository<TireChangeEvent> {
    @Override
    @EntityGraph(attributePaths = {"car", "nextEvent", "previousEvent", "company", "author", "access"})
    Optional<TireChangeEvent> findById(Long aLong);
}
