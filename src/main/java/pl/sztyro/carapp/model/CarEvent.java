package pl.sztyro.carapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import org.hibernate.annotations.Type;
import pl.sztyro.core.annotation.FrontendSearch;
import pl.sztyro.core.model.BaseEntity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class CarEvent extends BaseEntity {

    @Column
    @FrontendSearch
    private Integer mileage;

    @Column
    @FrontendSearch
    private Date date = new Date();

    @ManyToOne(fetch = FetchType.LAZY)
    @FrontendSearch(path = "name")
    @JsonIgnoreProperties({"lastInspection"})
    private Car car;

    @JoinColumn(name = "previous_id", referencedColumnName = "id")
    @OneToOne(fetch = FetchType.LAZY)
    @JsonIncludeProperties({"id", "date", "version", "type", "entityType"})
    private CarEvent previousEvent;

    @JoinColumn(name = "next_id", referencedColumnName = "id")
    @OneToOne(fetch = FetchType.LAZY)
    @JsonIncludeProperties({"id", "date", "version", "type", "entityType"})
    private CarEvent nextEvent;

    @Lob
    @Column
    @Type(type = "org.hibernate.type.TextType")
    private String remarks;

    @Column
    private Double price;


    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Integer getMileage() {
        return mileage;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public CarEvent getPreviousEvent() {
        return previousEvent;
    }

    public void setPreviousEvent(CarEvent previousEvent) {
        this.previousEvent = previousEvent;
    }

    public CarEvent getNextEvent() {
        return nextEvent;
    }

    public void setNextEvent(CarEvent nextEvent) {
        this.nextEvent = nextEvent;
    }

    @Override
    public String toString() {
        return "CarEvent{" +
                "mileage=" + mileage +
                ", date=" + date +
                '}';
    }


    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
