import { Component } from '@angular/core';
import { BaseFormComponent, BaseRestService, Div, InputField, DateField, ChipsField, TileSelect } from '@sztyro/core';
import { CarService } from 'src/app/services/car.service';
import { EventService } from 'src/app/services/event.service';
import { CarTimelineComponent } from '../../car-timeline/car-timeline.component';
import { InsuranceSummaryComponent } from '../../insurance-summary/insurance-summary.component';
import { TireSummaryComponent } from '../../tire-summary/tire-summary.component';

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
      this.fields = [
        Div.create('row',
          Div.create("col-xl-9 col-xxl-10 p-0",
            Div.create('row m-0',
              Div.tile('col-12', null,
                Div.create("col-md-6",
                  InputField.create({path: 'name', options: {isRequired: () => true}}),
                  DateField.create({path: 'productionYear', options: {startView: 'multi-year', hint: 'Required to calculate next inspection date.'}}),
                  ChipsField.create({path: 'lastInspection',options: { restpicker: Object.assign(this.events.defaultRestpickerOptions, {
                    showValue: e => new Date(e.date).toLocaleDateString(),
                    customMethod: params => this.events.getAll({...params, ...{type: 'Inspection'}})
                  })}})
                ),
                TileSelect.create({path: 'engineType', options:{class: 'col-md-6', selectOptions: this.resource.getEnum('pl.sztyro.carapp.enums.EngineType')}}),
              ),
              
              Div.tile('col-md-6 col-lg-4 col-xll-3', 'insurance-tile ripple',
                InsuranceSummaryComponent.create({path: null, options: { carId: this.object.id, class: 'w-100'}}),
              ).onClick(e => this.events.openCurrentInsurance(this.object.id)),
              Div.tile('col-sm-8', '',
                TireSummaryComponent.create({path: null, options: { carId: this.object.id, class: 'w-100 h-100'}}),
              ),

            ),
            
          ),
          
          Div.create('col-xl-3 col-xxl-2',
            Div.create('form-tile',
              CarTimelineComponent.create({path: null, options: {carId: this.object.id, class: 'w-100'}}),
            ),
          ),
        )
       
       
          
      ]
  }


}
