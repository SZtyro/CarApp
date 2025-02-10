package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.Tire;
import pl.sztyro.carapp.model.TireModel_;
import pl.sztyro.carapp.model.Tire_;
import pl.sztyro.core.rest.BaseController;

import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;

@RestController
@RequestMapping("/api/tires")
public class TireController extends BaseController<Tire> {

    public TireController() {
        super(TireController.class, Tire.class);
    }

    @Override
    protected void getFetch(Root<Tire> root) {
        root.fetch(Tire_.model, JoinType.LEFT).fetch(TireModel_.company, JoinType.LEFT);
    }

    @Override
    protected void getAllFetch(Root<Tire> root) {
        root.fetch(Tire_.model, JoinType.LEFT).fetch(TireModel_.company, JoinType.LEFT);
    }
}
