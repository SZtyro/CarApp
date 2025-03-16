import { Component } from '@angular/core';
import { BaseFormComponent, BaseRestService, Div, InputField, DateField, ChipsField, TileSelect, SelectField, SelectOption, GeneratorProperties } from '@sztyro/core';
import { CarService } from 'src/app/services/car.service';
import { EventService } from 'src/app/services/event.service';
import { CarTimelineComponent } from '../../car-timeline/car-timeline.component';
import { InsuranceSummaryComponent } from '../../insurance-summary/insurance-summary.component';
import { TireSummaryComponent } from '../../tire-summary/tire-summary.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-car-form',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.html',
  styleUrls: [
    './../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.scss',
    './car-form.component.scss'
  ]
})
export class CarFormComponent extends BaseFormComponent<any> {

  override resource: BaseRestService<any> = this.injector.get(CarService);
  private events: EventService = this.injector.get(EventService);

   

  override onModelChange(): void {
    super.onModelChange();
      
  }

  override getProperties(): GeneratorProperties<any>[] {
    return [
      Div.create('row',
        Div.create("col-xl-9 col-xxl-10 p-0",
          Div.create('row m-0',
            Div.tileStandard(
              InputField.create({path: 'name', options: {isRequired: () => true, class: 'col-md-6'}}),
              SelectField.create({path: 'engineType', options: {
                class: 'col-md-6',
                selectOptions: this.resource.getEnum('pl.sztyro.carapp.enums.EngineType').pipe(map(e => e.map(type => new SelectOption(type.name))))
              }})
            ),
            
            Div.tileWith('col-md-6 col-lg-4 col-xll-3', 'insurance-tile ripple',
              InsuranceSummaryComponent.create({path: null, options: { carId: this.object.id, class: 'w-100'}}),
            ).onClick(e => this.events.openCurrentInsurance(this.object.id)),
            Div.tileWith('col-sm-8', 'h-100',
              TireSummaryComponent.create({path: null, options: { carId: this.object.id, class: 'w-100 h-100'}}),
            ),

          ),
          
        ),
        
        Div.tileWith('col-xl-3 col-xxl-2', '',
            CarTimelineComponent.create({path: null, options: {carId: this.object.id, class: 'w-100'}}),
          
        ),
      )
     
     
        
    ]
  }


}
