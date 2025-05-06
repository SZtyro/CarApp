package pl.sztyro.carapp.model;

import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.interfaces.MenuItem;
import pl.sztyro.core.model.MenuNode;

import javax.persistence.Entity;

@Entity
@Secure(read = "", write = "")
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class RepairEvent extends CarEvent implements MenuItem {

    public static MenuNode getNode() {
        return CarEvent.getNode().pushChildren(
                MenuNode.builder()
                        .path("Events/" + RepairEvent.class.getName())
                        .build()
        );
    }
}
