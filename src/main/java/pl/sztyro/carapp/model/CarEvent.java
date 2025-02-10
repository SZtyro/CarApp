package pl.sztyro.carapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
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
public class CarEvent extends BaseEntity {

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
    @JsonIncludeProperties({"id", "date", "version", "type", "entityType"})
    private CarEvent previousEvent;

    @JoinColumn(name = "next_id", referencedColumnName = "id")
    @OneToOne(fetch = FetchType.LAZY)
    @JsonIncludeProperties({"id", "date", "version", "type", "entityType"})
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
