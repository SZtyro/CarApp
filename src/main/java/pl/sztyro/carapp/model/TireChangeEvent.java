package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;

import javax.persistence.*;
import java.util.Set;

@Entity
@Setter
@Getter
@SuperBuilder(toBuilder = true)
@Secure(read = "", write = "")
@NoArgsConstructor
public class TireChangeEvent extends CarEvent {

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tire_change_tires",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "tire_id"))
    private Set<Tire> tires;

}
