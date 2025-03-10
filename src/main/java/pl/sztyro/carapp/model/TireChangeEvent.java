package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity
@Setter
@Getter
@SuperBuilder(toBuilder = true)
@Secure(read = "", write = "")
@NoArgsConstructor
public class TireChangeEvent extends CarEvent {

    @ManyToMany(fetch = FetchType.LAZY)
    private Set<Tire> tires;

}
