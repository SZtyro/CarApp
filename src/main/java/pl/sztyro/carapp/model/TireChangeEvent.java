package pl.sztyro.carapp.model;

import pl.sztyro.core.annotation.Secure;

import javax.persistence.Entity;

@Entity
@Secure(read = "", write = "")
public class TireChangeEvent extends CarEvent {

}
