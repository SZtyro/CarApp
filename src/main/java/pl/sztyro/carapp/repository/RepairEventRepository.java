package pl.sztyro.carapp.repository;

import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.model.RepairEvent;
import pl.sztyro.core.interfaces.BaseRepository;

@Repository
public interface RepairEventRepository extends BaseRepository<RepairEvent> {
}
