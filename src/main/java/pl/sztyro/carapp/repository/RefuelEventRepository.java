package pl.sztyro.carapp.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.RefuelEvent;
import pl.sztyro.core.interfaces.BaseRepository;

import java.util.Optional;

@Repository
public interface RefuelEventRepository extends BaseRepository<RefuelEvent> {
    @Override
    @EntityGraph(attributePaths = {"car", "nextEvent", "previousEvent", "company", "author", "access"})
    Optional<RefuelEvent> findById(Long aLong);
}
