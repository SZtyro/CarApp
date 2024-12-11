package pl.sztyro.carapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import pl.sztyro.carapp.enums.EngineType;
import pl.sztyro.core.annotation.FrontendSearch;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.model.BaseEntity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Secure(read = "", write = "")
public class Car extends BaseEntity {

    @Column
    @FrontendSearch
    private String name;

    @Column
    @Enumerated(EnumType.STRING)
    private EngineType engineType;

    @Column
    private Date productionYear;

    @ManyToOne
    @JoinColumn(name = "last_inspection")
    @JsonIgnoreProperties({"car"})
    private CarEvent lastInspection;

    public Date getProductionYear() {
        return productionYear;
    }

    public void setProductionYear(Date productionYear) {
        this.productionYear = productionYear;
    }

    public CarEvent getLastInspection() {
        return lastInspection;
    }

    public void setLastInspection(CarEvent lastInspection) {
        this.lastInspection = lastInspection;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EngineType getEngineType() {
        return engineType;
    }

    public void setEngineType(EngineType engineType) {
        this.engineType = engineType;
    }
}
