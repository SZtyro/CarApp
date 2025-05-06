package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.carapp.enums.TirePlacement;
import pl.sztyro.core.annotation.FrontendSearch;
import pl.sztyro.core.annotation.MenuRoot;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.interfaces.MenuItem;
import pl.sztyro.core.model.BaseEntity;
import pl.sztyro.core.model.MenuNode;

import javax.persistence.*;
import java.util.Date;

import static pl.sztyro.core.model.BaseDictionary.getDictionaryNode;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@Entity
@NoArgsConstructor
@Secure(read = "", write = "")
@MenuRoot
public class Tire extends BaseEntity implements MenuItem {

    @Column
    private Integer tireWidth;

    @Column
    private Integer aspectRatio;

    @Column
    private Integer diameter;

    @Column
    private Integer loadRating;

    @Column
    private String speedRating;

    @FrontendSearch(path = "company.name", label = "pl.sztyro.carapp.model.TireCompany.HEADER")
    @FrontendSearch(path = "name")
    @ManyToOne(fetch = FetchType.LAZY)
    private TireModel model;

    @FrontendSearch
    @Enumerated(EnumType.STRING)
    private TirePlacement placement;

    @Column
    @FrontendSearch
    private Date date;

    @Override
    public String entityDescription() {
        TireModel m = model;
        if(m == null) m = new TireModel();
        TireCompany cmp = m.getCompany() != null ? m.getCompany() : new TireCompany();
        return String.format("%s %s %d/%d R%d %d %s",
                cmp.getName(),
                m.getName(),
                getTireWidth(),
                getAspectRatio(),
                getDiameter(),
                getLoadRating(),
                getSpeedRating()
       ).replaceAll("null", "?");
    }

    public static MenuNode getNode() {
        return MenuNode.builder()
            .path("Tires")
            .icon("radio_button_unchecked")
            .build();

    }
}
