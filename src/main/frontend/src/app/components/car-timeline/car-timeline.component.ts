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

  private carEventTypes:{type: string, icon: string}[] = []


  override ngOnInit(): void {
    super.ngOnInit();
    this.events.getAll({'car.id' : this.options.carId, size: 3}).subscribe(events => {
      this._carEvents = events.results.reverse();
    })

    this.events.getEventTypes().subscribe(events => {
      Object.keys(events).forEach(key => this.carEventTypes.push({type: key, icon: events[key]}));
    })
  }

  getIconFor?(type){
    return this.carEventTypes?.find(e => e.type == type)?.icon;
  }
}
