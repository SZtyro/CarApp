package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@Secure(read = "", write = "")
@SuperBuilder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
public class RefuelEvent extends CarEvent{

    @Column
    private Double amountOfFuel;

}
