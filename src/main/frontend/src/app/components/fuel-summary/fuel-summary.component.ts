import { Component } from '@angular/core';
import { Field, InstanceProperties } from '@sztyro/core';
import { GeneratorProperties } from '@sztyro/core';


@Component({
  selector: 'app-fuel-summary',
  templateUrl: './fuel-summary.component.html',
  styleUrls: ['./fuel-summary.component.scss']
})
export class FuelSummary extends Field<any>{
  
  static override create(options: InstanceProperties<any>): GeneratorProperties<any>{
    return {
      type: FuelSummary,
      config: options,
    }
  }

  calculate?(){
    
    let latestRefuelMileage = this.formRef.object.previousEvent?.mileage ?? 0;
    let n = Number((100 * this.formRef.object.amountOfFuel)/(this.formRef.object.mileage - latestRefuelMileage)).toFixed(2)
    if(n == 'NaN') return '?'
    else return n;
  }

  getPricePer100?(): string {
    let litresPer100 = this.calculate();
    if(litresPer100 != '?')
      return (this.formRef.object.price * Number(litresPer100)).toFixed(2);
    else return '?';
  }

  getDaysFromRefueling?(){
    return Math.floor((Math.abs((this.formRef.object.previousEvent?.date ?? 0) - this.formRef.object.date)) / 1000 / 60 / 60 /24)
  }

}
