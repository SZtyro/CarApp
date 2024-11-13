import { AfterViewInit, Component } from '@angular/core';
import { BaseFormComponent, BaseRestService, Div, InputField, DateField, ChipsField, TileSelect } from '@sztyro/core';
import { CarService } from 'src/app/services/car.service';
import { EventService } from 'src/app/services/event.service';
import { CarTimelineComponent } from '../../car-timeline/car-timeline.component';

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
  private events: BaseRestService<any> = this.injector.get(EventService);

  override fields = [
    Div.create('row',
      Div.create("col-md-6",
        InputField.create({path: 'name'}),
        DateField.create({path: 'productionYear', options: {startView: 'multi-year', hint: 'Required to calculate next inspection date.'}}),
        ChipsField.create({path: 'lastInspection',options: { restpicker: Object.assign(this.events.defaultRestpickerOptions, {
          showValue: e => new Date(e.date).toLocaleDateString(),
          customMethod: params => this.events.getAll({...params, ...{type: 'Inspection'}})
        })}})
      ),
      TileSelect.create({path: 'engineType', options:{class: 'col-md-6', selectOptions: this.resource.getEnum('pl.sztyro.carapp.enums.EngineType')}}),
      CarTimelineComponent.create({path: null, options: {carId: this.object.id}})
    )
      
  ]


}
