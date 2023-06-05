package pl.sztyro.carapp.model;

import javax.persistence.*;

@MappedSuperclass
public abstract class BaseDictionary {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String name;

    @Column
    private Boolean enabled = true;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
