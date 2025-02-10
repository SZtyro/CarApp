package pl.sztyro.carapp.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.InsuranceCompany;
import pl.sztyro.core.rest.BaseController;

import java.io.IOException;

@RequestMapping("/api/insuranceCompanies")
@RestController
public class InsuranceCompanyController extends BaseController<InsuranceCompany> {

    public InsuranceCompanyController() {
        super(InsuranceCompanyController.class, InsuranceCompany.class );
    }

    @Override
    public InsuranceCompany createEntity(InsuranceCompany init) {
        if(init != null) return init;
        else return InsuranceCompany.builder().build();
    }

    @Override
    @PreAuthorize("hasRole('ROLE_Admin')")
    public ResponseEntity<InsuranceCompany> create(InsuranceCompany entity) throws IOException {
        return super.create(entity);
    }
}
