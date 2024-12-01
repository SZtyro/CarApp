package pl.sztyro.carapp.model;

import pl.sztyro.core.model.BaseDictionary;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class InsuranceCompany extends BaseDictionary {

    @Column
    private String logoUrl;

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
}
