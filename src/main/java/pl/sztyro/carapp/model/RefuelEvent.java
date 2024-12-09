package pl.sztyro.carapp.model;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
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
