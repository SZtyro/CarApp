package pl.sztyro.carapp.service;

import org.springframework.stereotype.Service;
import pl.sztyro.carapp.model.Car;

@Service
public class RefuelService {

    public Car assignConsumption(Car car, Double consumption){
        if(car.getHighestConsumption() == null) {
            if(car.getLowestConsumption() == null )
                car.setLowestConsumption(consumption);
            else{
                if(car.getLowestConsumption() > consumption){
                    car.setHighestConsumption(car.getLowestConsumption());
                    car.setLowestConsumption(consumption);
                }else{
                    car.setHighestConsumption(consumption);
                }
            }
        }else{
            if(consumption > car.getHighestConsumption()) car.setHighestConsumption(consumption);
            else if (consumption < car.getLowestConsumption()) car.setLowestConsumption(consumption);
        }

        return car;
    }
}
