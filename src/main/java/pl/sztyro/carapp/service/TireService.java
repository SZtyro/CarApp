package pl.sztyro.carapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.sztyro.carapp.enums.TireType;
import pl.sztyro.carapp.model.Tire;
import pl.sztyro.core.service.DateService;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TireService {

    @Autowired
    private DateService dateService;

    public String getTiresAge(Set<Tire> tires) {

            Date now = dateService.now();
            StringBuilder tireAge = new StringBuilder();

            for (Tire tire : tires) {
                float result = (float) (now.getTime() - tire.getDate().getTime());
                result = result / 1000 / 60 / 60 / 24 / 365;
                tireAge.append(new BigDecimal(result).setScale(1,BigDecimal.ROUND_HALF_UP)).append("/");
            }
            if(!tireAge.isEmpty())
                tireAge = new StringBuilder(tireAge.substring(0, tireAge.length() - 1));
            String[] ages = tireAge.toString().split("/");
            if(Arrays.stream(ages).distinct().count() == 1)
                tireAge = Optional.ofNullable(ages[0]).map(StringBuilder::new).orElse(null);

            return tireAge == null ? null : tireAge.toString();

    }

    public TireType getTiresType(Set<Tire> tires){

        Set<TireType> tireTypes = tires.stream().map(tire -> tire.getModel().getType()).collect(Collectors.toSet());

        TireType type = null;
        int i = 0;
        for(TireType t : tireTypes) {
            if(i == 0) type = t;
            else if(!type.equals(t)) type = null;
            i++;
        };

        return type;
    }
}
