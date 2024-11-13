package pl.sztyro.carapp.repository;

import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.CarEvent;
import pl.sztyro.core.interfaces.BaseRepository;

@Repository
public interface CarEventRepository extends BaseRepository<CarEvent> {
}
