package pl.sztyro.carapp.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.sztyro.carapp.enums.CarCareType;
import pl.sztyro.core.annotation.Secure;
import pl.sztyro.core.interfaces.MenuItem;
import pl.sztyro.core.model.MenuNode;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@Secure(read = "", write = "")
@Getter
@Setter
@NoArgsConstructor
public class CarCareEvent extends CarEvent implements MenuItem {

    @Column
    private CarCareType careType;

    @Column
    private Integer timeSpent;

    public static MenuNode getNode() {
        return CarEvent.getNode().pushChildren(
                MenuNode.builder()
                        .path("Events/" + CarCareEvent.class.getName())
                        .build()
        );
    }
}
