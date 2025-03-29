package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.carapp.enums.EngineType;
import pl.sztyro.core.annotation.FrontendSearch;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.model.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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

    @Column
    private Double lowestConsumption;

    @Column
    private Double highestConsumption;
}
