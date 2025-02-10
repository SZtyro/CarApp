package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Secure(read = "", write = "")
@Getter
@Setter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class InsuranceEvent extends CarEvent {

    @ManyToOne
    private InsuranceCompany company;

}
