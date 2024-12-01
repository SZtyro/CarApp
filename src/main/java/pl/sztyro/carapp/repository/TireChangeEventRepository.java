package pl.sztyro.carapp.repository;

import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.TireChangeEvent;
import pl.sztyro.core.interfaces.BaseRepository;

@Repository
public interface TireChangeEventRepository extends BaseRepository<TireChangeEvent> {
}
