import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Field, FieldProperties, GeneratorProperties, InstanceProperties } from '@sztyro/core';
import { fromEvent, Observable, of } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import { EventService } from 'src/app/services/event.service';
import { TireCompanyService } from 'src/app/services/tire-company.service';

export class InsuranceSummaryProperties extends FieldProperties {
  carId: number;
}

type Summary = {
  type: string;
  mileage: string;
  age: string;
  tireSets: {
    placement:string[],
    logo:string
  }[]
}


@Component({
  selector: 'app-tire-summary',
  templateUrl: './tire-summary.component.html',
  styleUrl: './tire-summary.component.scss'
})
export class TireSummaryComponent extends Field<InsuranceSummaryProperties> implements AfterViewInit{
  static override create(options:InstanceProperties<InsuranceSummaryProperties>): GeneratorProperties<InsuranceSummaryProperties>{
    return {
      type: TireSummaryComponent,
      config: options,
    }
  }

  @ViewChild('axis', {static: false}) axis: ElementRef;

  events = this.injector.get(EventService);
  tireCompanies = this.injector.get(TireCompanyService);
  tireChangeIcon$: Observable<string>= this.events.getEventTypes().pipe(map(obj => obj['pl.sztyro.carapp.model.TireChangeEvent']));
  monthsOffsets: number[] = [];

  tireCompanyLogo: string;

  summary
  readonly today: Date = new Date();
  readonly yearAgo = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate());


  ngAfterViewInit(): void {
    this.renderAxis();
    fromEvent(window,'resize').pipe(auditTime(500)).subscribe(() => this.renderAxis());
    this.events.getTireSummary(this.formRef.object.id).subscribe(
      summary => this.summary = summary,
      err => this.interaction.defaultError(err)
    )
  }



  getIconForSummary(type: string){
    if(type == null) return 'question_mark'
    type = type[0].toUpperCase() + type.slice(1);
    switch(type){
      case 'Winter': return 'ac_unit';
      case 'Summer': return 'sunny';
      case 'All': return 'mode_dual';
      default: return 'question_mark'
    }
  }

  calculateEventWidth(event, index){
    
    let nextEventDate: number = (index + 1) === this.summary.events.length ? this.today.getTime() : this.summary.events[index + 1].date;
    let width = Math.abs(nextEventDate - event.date) / 1000 / 24 / 60 / 60; 
    
    return (width / 360) * 100;
    
  }

  calculateNewCarOffset(event){
    return (event.date - this.yearAgo.getTime()) / 1000 / 24 / 60 / 60 / 360 * 100; 
  }


  getMonthsBetween(){
    let between = [];
    let startMonth = this.yearAgo.getMonth() + 1;
    for(let i = startMonth; i < startMonth + 12; i++)
      between.push(new Date(this.yearAgo.getFullYear(), i, 1)); 

    between.reverse();
    return between;
  }

  renderAxis(){
    this.monthsOffsets = [];
    
    let element = this.axis.nativeElement;
    let ctx: CanvasRenderingContext2D = element.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = element.getBoundingClientRect();
    element.width = rect.width * dpr;
    element.height = rect.height * dpr;

    let fullAxis = element.width;

    ctx.scale(dpr, dpr);

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--sys-primary').trim();
    ctx.lineWidth = 4;
    
    ctx.moveTo(0, 0);
    ctx.lineTo(element.width, 0);
    ctx.stroke();

    ctx.lineWidth = 1;

    let lastDate = new Date(this.today);
    let lastDrawPoint = fullAxis;

    while(lastDate > this.yearAgo){
   
      let perc = (lastDate.getDate() * 100) / 365;
      let pixelOffset = (perc * fullAxis) / 100;

      lastDrawPoint = lastDrawPoint - pixelOffset;
      this.monthsOffsets.push(lastDrawPoint)

      ctx.moveTo(lastDrawPoint, 0);
      ctx.lineTo(lastDrawPoint, lastDate.getDate() === 31 ? 30 : 20);
      ctx.stroke();

      lastDate = new Date(lastDate.setDate(0));
    }
    
  }
  
  getLogoFor(companyId: number): Observable<string> {
    return this.tireCompanies.get(companyId).pipe(map(cmp => cmp.logoUrl))
  }
}
