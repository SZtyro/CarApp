package pl.sztyro.carapp.repository;

import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.RefuelEvent;
import pl.sztyro.core.interfaces.BaseRepository;

@Repository
public interface RefuelEventRepository extends BaseRepository<RefuelEvent> {
}
