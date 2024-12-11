package pl.sztyro.carapp.model;

import pl.sztyro.core.annotation.Secure;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@Secure(read = "", write = "")
public class RefuelEvent extends CarEvent{

    @Column
    private Double amountOfFuel;

    public Double getAmountOfFuel() {
        return amountOfFuel;
    }

    public void setAmountOfFuel(Double amountOfFuel) {
        this.amountOfFuel = amountOfFuel;
    }


}
