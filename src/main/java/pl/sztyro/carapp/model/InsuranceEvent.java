package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.interfaces.MenuItem;
import pl.sztyro.core.model.MenuNode;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Secure(read = "", write = "")
@Getter
@Setter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class InsuranceEvent extends NotifiableCarEvent implements MenuItem{

    @ManyToOne
    private InsuranceCompany company;

    public static MenuNode getNode() {
        return CarEvent.getNode().pushChildren(
                MenuNode.builder()
                        .path("Events/" + InsuranceEvent.class.getName())
                        .build()
        );
    }

}
