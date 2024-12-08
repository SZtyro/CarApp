import { Component } from '@angular/core';
import { Field, FieldProperties, GeneratorProperties, InstanceProperties } from '@sztyro/core';
import { EventService } from 'src/app/services/event.service';
import { InsuranceCompanyService } from 'src/app/services/insurance-company.service';

export class InsuranceSummaryProperties extends FieldProperties {
  carId: number;
}


@Component({
  selector: 'app-insurance-summary',
  templateUrl: './insurance-summary.component.html',
  styleUrl: './insurance-summary.component.scss'
})
export class InsuranceSummaryComponent extends Field<InsuranceSummaryProperties>  {

  insuranceCompanies = this.injector.get(InsuranceCompanyService);
  events = this.injector.get(EventService);

  currentInsurance:any = null;
  nextEvent:any = null;

  static override create(options:InstanceProperties<InsuranceSummaryProperties>): GeneratorProperties<InsuranceSummaryProperties>{
    return {
      type: InsuranceSummaryComponent,
      config: options,
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.events.getAll({
        'car.id' : this.options.carId,
        size: 1,
        entityType: 'pl.sztyro.carapp.model.InsuranceEvent',
        'nextEvent.id': '!null'
      }).subscribe(events => {
        if(events.results.length > 0)
          this.currentInsurance = events.results[0];

        this.events.get(this.currentInsurance.nextEvent.id).subscribe(event => this.nextEvent = event)
    })
  }

}
