package pl.sztyro.carapp.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
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
