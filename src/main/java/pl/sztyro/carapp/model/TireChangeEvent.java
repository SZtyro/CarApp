package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.interfaces.MenuItem;
import pl.sztyro.core.model.MenuNode;

import javax.persistence.*;
import java.util.Set;

@Entity
@Setter
@Getter
@SuperBuilder(toBuilder = true)
@Secure(read = "", write = "")
@NoArgsConstructor
public class TireChangeEvent extends NotifiableCarEvent implements MenuItem {

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tire_change_tires",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "tire_id"))
    private Set<Tire> tires;

    public static MenuNode getNode() {
        return CarEvent.getNode().pushChildren(
                MenuNode.builder()
                .path("Events/" + TireChangeEvent.class.getName())
                .build()
        );
    }
}
