package pl.sztyro.carapp.model;

import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import pl.sztyro.core.annotation.Secure;

import javax.persistence.Entity;

@Entity
@Secure(read = "", write = "")
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class RepairEvent extends CarEvent {
}
