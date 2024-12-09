package pl.sztyro.carapp.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.InsuranceEvent;
import pl.sztyro.core.interfaces.BaseRepository;

import java.util.Optional;

@Repository
public interface InsuranceEventRepository extends BaseRepository<InsuranceEvent> {
    @Override
    @EntityGraph(attributePaths = {"car", "nextEvent", "previousEvent", "company"})
    Optional<InsuranceEvent> findById(Long aLong);
}
