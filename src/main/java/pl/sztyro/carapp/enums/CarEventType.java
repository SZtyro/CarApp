package pl.sztyro.carapp.enums;

public enum CarEventType {
    Refuel("local_gas_station"),
    TireChange("tire_repair"),
    Repair("car_repair"),
    PartChange("construction"),
    Service("car_crash"),
    Insurance("security"),
    Inspection("check_box"),
    Incident("auto_towing"),
    Other("minor_crash");

    public final String icon;

    CarEventType(String icon) {
        this.icon = icon;
    }
}
