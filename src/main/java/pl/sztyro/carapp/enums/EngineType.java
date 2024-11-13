package pl.sztyro.carapp.enums;

public enum EngineType {
    Petrol("local_gas_station", "petrol-tile"),
    Diesel("local_gas_station", "diesel-tile"),
    Electric("ev_charger", "electric-tile"),
    Hybrid("swap_driving_apps", "hybrid-tile"),
    Hydrogen("format_h2", "hydrogen-tile");
;
    public final String icon, htmlClass;

    EngineType(String icon, String htmlClass) {
        this.icon = icon;
        this.htmlClass = htmlClass;
    }
}
