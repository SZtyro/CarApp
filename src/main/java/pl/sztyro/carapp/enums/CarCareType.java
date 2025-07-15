package pl.sztyro.carapp.enums;

public enum CarCareType {
    SERVICE("parking_valet"),
    WASHING("local_car_wash"),
    ACCESSORY("format_paint");

    public final String icon;

    CarCareType(String icon){this.icon = icon;}
}
