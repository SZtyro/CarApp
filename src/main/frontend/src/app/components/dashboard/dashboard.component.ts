import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, map, merge, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { RoleService, Utils } from '@sztyro/core'
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js/auto';
import { CarService } from './../../services/car.service';

type DashboardEvent = {car: any, events: any[]}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('chart', { static: true }) chartRef!: ElementRef<HTMLCanvasElement>;


  private carEventTypes: object;

  constructor(
    private events: EventService,
    private roles: RoleService,
    private translate: TranslateService,
    private cars: CarService
  ) { }


  mainCar$: Observable<any> = this.cars.getAll().pipe(
    map(cars => cars.results[0])
  )

  today: Date = new Date();
  monthLater: Date = new Date(this.today.getFullYear(),this.today.getMonth() + 1, this.today.getDate());
  incomingEvents$: Observable<DashboardEvent[]> = this.events.getAll({
    "sort": 'date:ASC',
    'date:From': this.today.getTime(),
    'date:To': this.monthLater.getTime(),
  }).pipe(map(response => {
    let grouped: DashboardEvent[] = []
    response.results.forEach((event) => {
      let elem = grouped.find(e => e.car.id === event.car.id);
      if(elem != null) elem.events.push(event)
      else grouped.push({car: event.car, events: [event]}); 
    })
    return grouped;
  }));

  newsSwitch$: Subject<'Article'| 'Changelog' | 'Voting'> = new BehaviorSubject('Article');
  news: any[] = [];

  ngOnInit(): void {
    
    combineLatest([
      this.translate.onLangChange.pipe(
        map(event => event.lang),
        startWith(this.translate.currentLang)
      ), 
      this.newsSwitch$
    ])
    .pipe(
      switchMap(([lang, type]) => this.getNews(lang, type)  
    ))
    .subscribe(news => this.news = news);

    this.roles.current().subscribe(console.log)
    this.events.getEventTypes().subscribe(types => {
      this.carEventTypes = types;
    })

  

  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  getIconFor?(type){
    return this.carEventTypes[type];
  }


  /**
   * Method fetches news from the server
   * @param lang 
   * @returns 
   */

  getNews(lang: string, type:string): Observable<any[]>{
    
    //Demo
    return of([
      {
        lang: 'pl_PL', 
        title: 'Demonstracyjne elementy aplikacji', 
        preview: 'Najnowsze aktualizacje będą zawierały elementy demonstracyjne. Będą one zawierały statyczne informacje pozwalając na zapoznanie się z koncepcją. Na priorytet wprowadzania tych elementów będzie można zagłosować w ankietach. ',
        date: new Date(2025, 2, 20),
        icon: 'star',
        type: 'Article'
      },
      {
        lang: 'pl_PL', 
        title: 'Nowy sposób przedstawiania statystyk', 
        preview: 'W najnowszej aktualizacji dodano porównanie ostatniego wyniku konsumpcji paliwa do ogólnego średniego wyniku. Dzięki temu łatwiej jest zauważyć czy nasze osiągi są lepsze czy gorsze od przeciętnych.',
        date: new Date(2025, 2, 10),
        icon: 'star',
        type: 'Article'
      },

      {
        lang: 'en_US', 
        title: 'Demonstration elements of the application', 
        preview: 'The latest updates will include demonstration elements. They will contain static information allowing you to get acquainted with the concept. You will be able to vote on the priority of introducing these elements in the surveys.',
        date: new Date(2025, 2, 20),
        icon: 'star',
        type: 'Article'
      },
      {
        lang: 'en_US', 
        title: 'New way of presenting statistics', 
        preview: 'In the latest update, a comparison of the last fuel consumption result to the overall average result has been added. This makes it easier to see if our performance is better or worse than average.',
        date: new Date(2025, 2, 10),
        icon: 'star',
        type: 'Article'
      },

      {
        lang: 'pl_PL',
        title: 'Elementy demo, dashboard',
        version: '0.4.2',
        fixes: ['Naprawiono błąd blokujący dodanie samochodu z zasobu', 'Naprawiono błąd uniemożliwiający dodanie nowego wydarzenia'],
        added: ['[Demo] Dodano komponent z nowościami i ankietami', '[Demo] Dodano komponent ze statystykami', '[Demo] Dodano przykładowe dane do kont tymczasowych'],
        date: new Date(2025, 2, 5),
        type: 'Changelog'
      },
      {
        lang: 'en_US',
        title: 'Demo elements, dashboard',
        version: '0.4.2',
        fixes: ['Fixed a bug blocking adding a car from a resource', 'Fixed a bug preventing adding a new event'],
        added: ['[Demo] Added a component with news and surveys', '[Demo] Added a component with statistics', '[Demo] Added sample data to temporary accounts'],
        date: new Date(2025, 2, 5),
        type: 'Changelog'
      }
    ]).pipe(
      map(news => news.filter(n => n.lang === lang && n.type === type.toString()))
    );
  }

  createChart(): void {

    const months = Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat(this.translate.currentLang.split('_')[0], { month: 'long' }).format(new Date(2000, i))
    ).map(month => month[0].toUpperCase() + month.slice(1));

    const refuelings = [600, 550, 580, 620, 590, 610, 630, 600, 620, 580, 600, 590];
    const repairs = [0, 0, 0, 0, 0, 0, 0, 1200, 0, 0, 0, 1500];
    const others = [0, 0, 0, 200, 0, 0, 0, 0, 0, 300, 200, 1200];

    this.translate.get([
      'pl.sztyro.carapp.model.RefuelEvent.HEADER',
      'pl.sztyro.carapp.model.RepairEvent.HEADER',
      'Others'
    ]).subscribe(translations => {
      
      new Chart(this.chartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              label: translations['pl.sztyro.carapp.model.RefuelEvent.HEADER'],
              data: refuelings,
              backgroundColor: Utils.Style.hexAdjustBrightness(Utils.Style.getCssVariable('--sys-primary-fixed-dim'), 0.5),
              borderRadius: 12,
              stack: 'costs'
            },
            {
              label: translations['pl.sztyro.carapp.model.RepairEvent.HEADER'],
              data: repairs,
              backgroundColor: Utils.Style.hexAdjustBrightness(Utils.Style.getCssVariable('--sys-primary-fixed-dim'), 0.6),
              borderRadius: 12,
              stack: 'costs'
            },
            {
              label:  translations['Others'],
              data: others,
              backgroundColor: Utils.Style.hexAdjustBrightness(Utils.Style.getCssVariable('--sys-primary-fixed-dim'), 0.7),
              borderRadius: 12,
              stack: 'costs'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, 
          scales: {
            y: { beginAtZero: true }
          },
          plugins: {
            tooltip: {
              enabled: true, 
              backgroundColor: Utils.Style.getCssVariable('--sys-surface-dim'), 
              titleColor: Utils.Style.getCssVariable('--sys-on-surface') , 
              bodyColor: Utils.Style.getCssVariable('--sys-on-surface'), 
              usePointStyle: true,
              caretSize: 0,
              cornerRadius: 8,
              padding: 10,
              displayColors: false,
              callbacks: {
                label: function (context) {
                  
                  return `${context.dataset.label}: ${context.raw} zł`; 
                }
              }
            }
          },
        }
      });
    })
    
    
  }

}
