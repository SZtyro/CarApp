package pl.sztyro.carapp.model;

import pl.sztyro.core.annotation.Secure;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Secure(read = "", write = "")
public class InsuranceEvent extends CarEvent {

    @ManyToOne
    private InsuranceCompany company;

    public InsuranceCompany getCompany() {
        return company;
    }

    public void setCompany(InsuranceCompany company) {
        this.company = company;
    }
}
