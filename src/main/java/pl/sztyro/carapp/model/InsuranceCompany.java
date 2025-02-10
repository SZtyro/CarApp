package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.model.BaseDictionary;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@Secure()
@Getter
@Setter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class InsuranceCompany extends BaseDictionary {

    @Column
    private String logoUrl;

}
