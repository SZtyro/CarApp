package pl.sztyro.carapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.carapp.enums.EngineType;
import pl.sztyro.core.annotation.FrontendSearch;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.model.BaseEntity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Secure(read = "", write = "")
@SuperBuilder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
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

    @Column
    private Double lowestConsumption;

    @Column
    private Double highestConsumption;
}
