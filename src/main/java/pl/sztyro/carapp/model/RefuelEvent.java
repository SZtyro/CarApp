package pl.sztyro.carapp.model;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class RefuelEvent extends CarEvent{

    @Column
    private Double price;

    @Column
    private Double amountOfFuel;


    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getAmountOfFuel() {
        return amountOfFuel;
    }

    public void setAmountOfFuel(Double amountOfFuel) {
        this.amountOfFuel = amountOfFuel;
    }


}
