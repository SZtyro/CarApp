import { Component } from '@angular/core';
import { Field, InstanceProperties, GeneratorProperties, FieldProperties } from '@sztyro/core';
import { EventService } from 'src/app/services/event.service';

export class CarTimelineProperties extends FieldProperties {
  carId: number;
}


@Component({
  selector: 'app-car-timeline',
  templateUrl: './car-timeline.component.html',
  styleUrl: './car-timeline.component.scss'
})
export class CarTimelineComponent extends Field<CarTimelineProperties> {

  events = this.injector.get(EventService);


  static override create(options:InstanceProperties<CarTimelineProperties>): GeneratorProperties<CarTimelineProperties>{
    return {
      type: CarTimelineComponent,
      config: options,
    }
  }

  _carEvents?: any[];
  _today?: number = new Date().getTime();
  _carEventTypes?: any[];


  override ngOnInit(): void {
    super.ngOnInit();
    this.events.getAll({'car.id' : this.options.carId, size: 8}).subscribe(events => {
      this._carEvents = events.results.reverse();
    })

    this.events.getEnum('pl.sztyro.carapp.enums.CarEventType').subscribe(events => {
      this._carEventTypes = events;
      
    })
  }

  _getIconFor?(type){
    return this._carEventTypes?.find(e => e.name == type)?.icon;
  }
}
