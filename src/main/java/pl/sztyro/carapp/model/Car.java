package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.carapp.enums.EngineType;
import pl.sztyro.core.annotation.FrontendSearch;
import pl.sztyro.core.annotation.MenuRoot;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.interfaces.MenuItem;
import pl.sztyro.core.model.BaseEntity;
import pl.sztyro.core.model.MenuNode;

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
@MenuRoot
public class Car extends BaseEntity implements MenuItem {

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

    public static MenuNode getNode() {
        return MenuNode.builder()
            .path("Cars")
            .icon("directions_car")
            .build();
    }
}
