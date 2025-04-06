import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
export class CarTimelineComponent extends Field<CarTimelineProperties> implements AfterViewInit {

  events = this.injector.get(EventService);

  @ViewChild('content', { static: true }) content: any;


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
    this.events.getAll({'car.id' : this.options.carId, size: 7, sort: 'date:DESC'}).subscribe(events => {
      this._carEvents = events.results.reverse();
      let index = 0;
      let closestDate = 0;
      while (closestDate < this._today) {
        closestDate = this._carEvents[index].date;
        index++;
      }
      
      let todayElem = {date: this._today, entityType: 'today'};
      
      if(index > 0)  this._carEvents.splice(index - 1, 0, todayElem)
      else this._carEvents.unshift(todayElem);
    })

    this.events.getEventTypes().subscribe(events => {
      Object.keys(events).forEach(key => this.carEventTypes.push({type: key, icon: events[key]}));
    })
  }
  
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.content.nativeElement.scrollTo({
        left: this.content.nativeElement.scrollWidth,
        behavior: 'smooth'
      });
    }, 10);
    
   
  }

  getIconFor?(type){
    if(type === 'today') return 'today';
    return this.carEventTypes?.find(e => e.type == type)?.icon;
  }

  getHref(event:any): string{  
    return event.entityType != 'today' ? `/${event.entityType}/${event.id}`: null
  }
}
