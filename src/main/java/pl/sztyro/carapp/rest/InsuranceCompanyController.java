package pl.sztyro.carapp.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sztyro.carapp.model.InsuranceCompany;
import pl.sztyro.core.rest.BaseController;

@RequestMapping("/api/insuranceCompanies")
@RestController
public class InsuranceCompanyController extends BaseController<InsuranceCompany> {

    public InsuranceCompanyController() {
        super(InsuranceCompanyController.class, InsuranceCompany.class );
    }

    @Override
    public InsuranceCompany createEntity(InsuranceCompany init) {
        if(init != null) return init;
        else return new InsuranceCompany();
    }
}
