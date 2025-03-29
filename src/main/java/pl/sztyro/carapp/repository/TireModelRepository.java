package pl.sztyro.carapp.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import pl.sztyro.carapp.enums.TireType;
import pl.sztyro.carapp.model.TireModel;
import pl.sztyro.core.interfaces.BaseRepository;

import java.util.Optional;

@Repository
public interface TireModelRepository extends BaseRepository<TireModel> {

    @Override
    @EntityGraph(attributePaths = {"author", "access", "company"})
    Optional<TireModel> findById(Long aLong);

    TireModel findByName(String name);
    TireModel findFirstByType(TireType type);
}
