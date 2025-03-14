import { Component } from '@angular/core';
import { Field, InstanceProperties } from '@sztyro/core';
import { GeneratorProperties } from '@sztyro/core';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-fuel-summary',
  templateUrl: './fuel-summary.component.html',
  styleUrls: ['./fuel-summary.component.scss']
})
export class FuelSummary extends Field<any>{

  events = this.injector.get(EventService)
  
  static override create(options: InstanceProperties<any>): GeneratorProperties<any>{
    return {
      type: FuelSummary,
      config: options,
    }
  }

  calculate?(){
    let latestRefuelMileage = this.formRef?.object.previousEvent?.mileage ?? 0;
    let n = Number((100 * this.formRef?.object.amountOfFuel)/(this.formRef?.object.mileage - latestRefuelMileage)).toFixed(2)
    if(n == 'NaN') return '?'
    else return n;
  }

  getPricePer100?(): string {
    let litresPer100 = this.calculate();
    if(litresPer100 != '?')
      return (this.formRef?.object.price * Number(litresPer100)).toFixed(2);
    else return '?';
  }

  getDaysFromRefueling?(): number{
    return Math.floor((Math.abs((this.formRef?.object.previousEvent?.date ?? 0) - this.formRef?.object.date)) / 1000 / 60 / 60 /24)
  }

  getDistanceTraveled(): number{
    return (this.formRef?.object.mileage ?? 0) - (this.formRef?.object.previousEvent?.mileage ?? 0)
  }

  getConsumptionResult(): string{
    let consumption = this.calculate();
    let car = this.formRef?.object.car;
    if(car != null && consumption !== '?' && consumption != null && car.highestConsumption != null && car.highestConsumption != null){
      if(car.highestConsumption <= consumption) return '0%'
      else if (car.lowestConsumption >= consumption) return '100%'
      else {
        let percentage = 100 - (Number(consumption) - car.lowestConsumption) / (car.highestConsumption - car.lowestConsumption) * 100
        return percentage.toFixed(2) + '%'
      }
    }else return '50%';
  }

  getProgress(): string{
    return `calc(${this.getConsumptionResult()} - 6px)`
  }

  getFloatingOffset(): string{
    let percent = Number(this.getConsumptionResult().replace('%',''));
    if(percent > 50) return 'left: -200px';
    else return '';
    
  }

}
