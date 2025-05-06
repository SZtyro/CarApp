package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.interfaces.MenuItem;
import pl.sztyro.core.model.MenuNode;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@Secure(read = "", write = "")
@SuperBuilder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
public class RefuelEvent extends CarEvent implements MenuItem {

    @Column
    private Double amountOfFuel;

    public static MenuNode getNode() {
        return CarEvent.getNode().pushChildren(
                MenuNode.builder()
                        .path("Events/" + RefuelEvent.class.getName())
                        .build()
        );
    }

}
