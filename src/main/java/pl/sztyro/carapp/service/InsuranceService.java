package pl.sztyro.carapp.service;

import com.sun.istack.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.sztyro.carapp.model.Car;
import pl.sztyro.carapp.model.Car_;
import pl.sztyro.carapp.model.InsuranceEvent;
import pl.sztyro.carapp.model.InsuranceEvent_;
import pl.sztyro.core.service.DateService;

import javax.persistence.EntityManager;
import javax.persistence.criteria.*;

@Service
@RequiredArgsConstructor
public class InsuranceService {

    private final EntityManager em;
    private final DateService dateService;

    public InsuranceEvent getCurrentInsurance(@NotNull Long carId){
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<InsuranceEvent> query = cb.createQuery(InsuranceEvent.class);
        Root<InsuranceEvent> from = query.from(InsuranceEvent.class);
        Join<InsuranceEvent, Car> fCar = from.join(InsuranceEvent_.car, JoinType.LEFT);

        query.where(
                cb.equal(fCar.get(Car_.id), carId),
                cb.lessThanOrEqualTo(from.get(InsuranceEvent_.date), dateService.now())
        );

        query.orderBy(cb.desc(from.get(InsuranceEvent_.date)));

        return em.createQuery(query)
                .setMaxResults(1)
                .getSingleResult();
    }
}
