package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.carapp.enums.TireType;
import pl.sztyro.core.annotation.FrontendSearch;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.model.BaseDictionary;

import javax.persistence.*;

@Setter
@Getter
@Entity
@Secure()
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class TireModel extends BaseDictionary {

    @FrontendSearch(path = "company.name")
    @ManyToOne(fetch = FetchType.LAZY)
    private TireCompany company;

    @FrontendSearch
    @Enumerated(EnumType.STRING)
    private TireType type;
}
