package pl.sztyro.carapp.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.RepairEvent;
import pl.sztyro.core.interfaces.BaseRepository;

import java.util.Optional;

@Repository
public interface RepairEventRepository extends BaseRepository<RepairEvent> {
    @Override
    @EntityGraph(attributePaths = {"car", "nextEvent", "previousEvent", "company", "author", "access"})
    Optional<RepairEvent> findById(Long aLong);
}
