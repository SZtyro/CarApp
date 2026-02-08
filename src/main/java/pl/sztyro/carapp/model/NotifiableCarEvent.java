package pl.sztyro.carapp.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.time.LocalDate;

@MappedSuperclass
@Getter
@Setter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public abstract class NotifiableCarEvent extends CarEvent{

    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDate fireDate;
}
