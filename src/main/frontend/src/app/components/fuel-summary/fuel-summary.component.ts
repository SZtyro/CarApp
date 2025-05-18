import { Component } from '@angular/core';
import { Field, InstanceProperties } from '@sztyro/core';
import { GeneratorProperties } from '@sztyro/core';
import { EventService } from 'src/app/services/event.service';
import { EventFormComponent } from '../forms/event-form/event-form.component';


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
    let totalPrice = this.formRef?.object.price;
    let cuantity = this.formRef?.object.amountOfFuel;
    
    if(litresPer100 != '?')
      return ((totalPrice / cuantity) * Number(litresPer100)).toFixed(2);
    else return '?';
  }

  getDaysFromRefueling?(): number{
    return Math.floor((Math.abs((this.formRef?.object.previousEvent?.date ?? 0) - this.formRef?.object.date)) / 1000 / 60 / 60 /24)
  }

  getDistanceTraveled(): number{
    return (this.formRef?.object.mileage ?? 0) - (this.formRef?.object.previousEvent?.mileage ?? 0)
  }

  getConsumptionResult(): number{
    let consumption = this.calculate();
    let car = this.formRef?.object.car;
    if((this.formRef as EventFormComponent).isRefuelEvent() && car != null && consumption !== '?' && consumption != null && car.highestConsumption != null && car.highestConsumption != null){
      if(car.highestConsumption <= consumption) return 0
      else if (car.lowestConsumption >= consumption) return 100
      else {
        return (Number(consumption) - car.lowestConsumption) / (car.highestConsumption - car.lowestConsumption) * 100;
      }
    }else return 50;
  }

}
