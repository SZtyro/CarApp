package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.TireModel;
import pl.sztyro.carapp.model.TireModel_;
import pl.sztyro.core.rest.BaseController;

import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;

@RestController
@RequestMapping("/api/tireModels")
public class TireModelController extends BaseController<TireModel> {

    public TireModelController() {
        super(TireModelController.class, TireModel.class);
    }

    @Override
    public TireModel createEntity(TireModel init) {
        return init != null ? init : TireModel.builder().build();
    }

    @Override
    protected void getAllFetch(Root<TireModel> root) {
        root.fetch(TireModel_.company, JoinType.LEFT);
    }
}
