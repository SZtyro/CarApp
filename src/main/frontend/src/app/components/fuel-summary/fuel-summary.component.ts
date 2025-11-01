import { Component, inject } from '@angular/core';
import { FormElement, FormElementBuilder } from '@sztyro/core';
import { EventService } from 'src/app/services/event.service';
import { EventFormComponent } from '../forms/event-form/event-form.component';
import { Renderable } from '@sztyro/core/lib/form-builder/interface/renderable';


@Component({
  selector: 'app-fuel-summary',
  templateUrl: './fuel-summary.component.html',
  styleUrls: ['./fuel-summary.component.scss']
})
export class FuelSummary extends FormElement{

  static builder(parent: Renderable){
    return new FuelSummaryBuilder(FuelSummary, parent);
  }

  events = inject(EventService)
  

  calculate?(){
    let object = this.getFormRef()?.object();
    let latestRefuelMileage = object.previousEvent?.mileage ?? 0;
    let distanceTraveled = object.mileage - latestRefuelMileage;
    let amount = object.amountOfFuel;

    if(distanceTraveled == 0) return '0'
    if(latestRefuelMileage == 0) return '?'

    let n = Number(100 * amount/distanceTraveled).toFixed(2)
    if(n == 'NaN') return '?'
    else return n;
  }

  getPricePer100?(): string {
    let litresPer100 = this.calculate();
    let totalPrice = this.getFormRef()?.object().price;
    let cuantity = this.getFormRef()?.object().amountOfFuel;

    if(litresPer100 != '?')
      return ((totalPrice / cuantity) * Number(litresPer100)).toFixed(2);
    else return '?';
  }

  getDaysFromRefueling?(): number{
    return Math.floor((Math.abs(( this.getFormRef()?.object().previousEvent?.date ?? 0) -  this.getFormRef()?.object().date)) / 1000 / 60 / 60 /24)
  }

  getDistanceTraveled(): number{
    return ( this.getFormRef()?.object().mileage ?? 0) - ( this.getFormRef()?.object().previousEvent?.mileage ?? 0)
  }

  getConsumptionResult(): number{
    let consumption = this.calculate();
    let car = this.getFormRef()?.object().car;
    if((this.getFormRef() as EventFormComponent)?.isRefuelEvent() && car != null && consumption !== '?' && consumption != null && car.highestConsumption != null && car.highestConsumption != null){
      if(car.highestConsumption <= consumption) return 0
      else if (car.lowestConsumption >= consumption) return 100
      else {
        return (Number(consumption) - car.lowestConsumption) / (car.highestConsumption - car.lowestConsumption) * 100;
      }
    }else return 50;
  }

}

export class FuelSummaryBuilder extends FormElementBuilder<FuelSummary>{

}
