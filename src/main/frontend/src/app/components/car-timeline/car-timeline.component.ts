import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormElement, FormElementBuilder } from '@sztyro/core';
import { Renderable } from '@sztyro/core/lib/form-builder/interface/renderable';
import { EventService } from 'src/app/services/event.service';
import { InsuranceSummaryBuilder } from '../insurance-summary/insurance-summary.component';


@Component({
  selector: 'app-car-timeline',
  templateUrl: './car-timeline.component.html',
  styleUrl: './car-timeline.component.scss'
})
export class CarTimelineComponent extends FormElement implements OnInit, AfterViewInit {

  @ViewChild('content', { static: true }) content: any;
  
  events = inject(EventService);

  carId: number;
  _carEvents?: any[];
  _today?: number = new Date().getTime();

  private carEventTypes:{type: string, icon: string}[] = []


  ngOnInit(): void {
    this.events.getAll({'car.id' : this.carId, size: 7, sort: 'date:DESC'}).subscribe(events => {
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

  static builder(parent: Renderable): InsuranceSummaryBuilder{
    return new InsuranceSummaryBuilder(CarTimelineComponent, parent)
  }

}

export class CarTimelineBuilder extends FormElementBuilder<CarTimelineComponent>{

  carId(id: number){
    this.ref.instance.carId = id;
    return this;
  }
}
