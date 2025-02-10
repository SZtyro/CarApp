package pl.sztyro.carapp.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.TireCompany;
import pl.sztyro.core.rest.BaseController;

import java.io.IOException;

@RequestMapping("/api/tireCompanies")
@RestController
public class TireCompanyController extends BaseController<TireCompany> {

    public TireCompanyController() {
        super(TireCompanyController.class, TireCompany.class );
    }

    @Override
    public TireCompany createEntity(TireCompany init) {
        if(init != null) return init;
        else return TireCompany.builder().build();
    }

    @Override
    @PreAuthorize("hasRole('ROLE_Admin')")
    public ResponseEntity<TireCompany> create(TireCompany entity) throws IOException {
        return super.create(entity);
    }

}

