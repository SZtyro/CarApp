package pl.sztyro.carapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Type;
import pl.sztyro.core.annotation.FrontendSearch;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.model.BaseEntity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Secure(read = "", write = "")
@SuperBuilder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "entityType")
@JsonSubTypes({
        @JsonSubTypes.Type(value = RefuelEvent.class, name = "pl.sztyro.carapp.model.RefuelEvent"),
        @JsonSubTypes.Type(value = TireChangeEvent.class, name = "pl.sztyro.carapp.model.TireChangeEvent"),
        @JsonSubTypes.Type(value = InsuranceEvent.class, name = "pl.sztyro.carapp.model.InsuranceEvent"),
        @JsonSubTypes.Type(value = RepairEvent.class, name = "pl.sztyro.carapp.model.RepairEvent"),
})
public abstract class CarEvent extends BaseEntity {

    @Column
    @FrontendSearch
    private Integer mileage;

    @Column
    @FrontendSearch
    private Date date = new Date();

    @ManyToOne(fetch = FetchType.LAZY)
    @FrontendSearch(path = "name")
    @JsonIgnoreProperties({"lastInspection"})
    private Car car;

    @JoinColumn(name = "previous_id", referencedColumnName = "id")
    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"previousEvent", "nextEvent",})
    private CarEvent previousEvent;

    @JoinColumn(name = "next_id", referencedColumnName = "id")
    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"previousEvent", "nextEvent",})
    private CarEvent nextEvent;

    @Lob
    @Column
    @Type(type = "org.hibernate.type.TextType")
    private String remarks;

    @Column
    private Double price;


    @Override
    public String toString() {
        return "CarEvent{" +
                "mileage=" + mileage +
                ", date=" + date +
                '}';
    }

}
