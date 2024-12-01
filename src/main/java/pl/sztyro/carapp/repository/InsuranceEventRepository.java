package pl.sztyro.carapp.repository;

import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.InsuranceEvent;
import pl.sztyro.core.interfaces.BaseRepository;

@Repository
public interface InsuranceEventRepository extends BaseRepository<InsuranceEvent> {
}
