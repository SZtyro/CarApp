package pl.sztyro.carapp.model;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class EventType extends BaseDictionary {

    @Column
    private String iconCode;

    public String getIconCode() {
        return iconCode;
    }

    public void setIconCode(String icon) {
        this.iconCode = icon;
    }
}
