package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.model.BaseDictionary;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.Set;

@Entity
@Secure()
@SuperBuilder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
public class TireCompany extends BaseDictionary {

    @Column
    private String logoUrl;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private Set<TireModel> models;

}
