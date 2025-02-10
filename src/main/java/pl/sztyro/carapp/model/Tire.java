package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.carapp.enums.TirePlacement;
import pl.sztyro.core.annotation.FrontendSearch;
import pl.sztyro.core.model.BaseEntity;

import javax.persistence.*;
import java.util.Date;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@Entity
@NoArgsConstructor

public class Tire extends BaseEntity {

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
}
