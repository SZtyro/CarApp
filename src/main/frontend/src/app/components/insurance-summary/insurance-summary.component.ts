import { Component, inject } from '@angular/core';
import { FormElement, FormElementBuilder } from '@sztyro/core';
import { Renderable } from '@sztyro/core/lib/form-builder/interface/renderable';
import { EventService } from 'src/app/services/event.service';
import { InsuranceCompanyService } from 'src/app/services/insurance-company.service';

@Component({
  selector: 'app-insurance-summary',
  templateUrl: './insurance-summary.component.html',
  styleUrl: './insurance-summary.component.scss'
})
export class InsuranceSummaryComponent extends FormElement  {

  insuranceCompanies = inject(InsuranceCompanyService);
  events = inject(EventService);

  carId: number;
  currentInsurance:any = null;

  ngAfterViewInit(): void {
    this.events.getCurrentInsurance(this.carId).subscribe(event => {  
      this.currentInsurance = event;
    })
    
  }

  onClick(){
    this.events.openCurrentInsurance(this.carId);
  }

  static builder(parent: Renderable): InsuranceSummaryBuilder{
    return new InsuranceSummaryBuilder(InsuranceSummaryComponent, parent)
  }

}

export class InsuranceSummaryBuilder extends FormElementBuilder<InsuranceSummaryComponent>{

  carId(id: number){
    this.ref.instance.carId = id;
    return this;
  }
}
