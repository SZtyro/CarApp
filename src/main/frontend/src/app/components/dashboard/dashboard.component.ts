import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { RoleService, Utils } from '@sztyro/core'
import { TranslateService } from '@ngx-translate/core';
import { CarService } from './../../services/car.service';
import { ChartConfiguration } from 'chart.js/auto';

type DashboardEvent = {car: any, events: any[]}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private carEventTypes: object = {};

  constructor(
    private events: EventService,
    private roles: RoleService,
    private translate: TranslateService,
    private cars: CarService
  ) { 
    this.incomingEvents$ = this.events.getAll({
      "sort": 'date:ASC',
      "size": 3,
      'date:From': this.today.getTime(),
      'date:To': this.monthLater.getTime(),
    }).pipe(map(response => {
      let grouped: DashboardEvent[] = []
      response.results.forEach((event) => {
        let elem = grouped.find(e => e.car?.id === event.car?.id);
        if(elem != null) elem.events.push(event)
        else grouped.push({car: event.car, events: [event]}); 
      })
      return grouped;
    }))

    this.mainCar$ = this.cars.getAll().pipe(
      map(cars => cars.results?.[0])
    )
   this.prepareChart();

  }


  
  mainCar$: Observable<any>;
  langSubscritpion$: Subscription;
  carEventTypesSubscritpion$: Subscription;

  today: Date = new Date();
  monthLater: Date = new Date(this.today.getFullYear(),this.today.getMonth() + 1, this.today.getDate());
  incomingEvents$: Observable<DashboardEvent[]>;
  summaryChartConfig$: Observable<ChartConfiguration>;

  newsSwitch$: Subject<'Article'| 'Changelog' | 'Voting'> = new BehaviorSubject('Article');
  news: any[] = [];
  newsActions: any[] = [
    {icon: 'news', action: 'Article'},
    {icon: 'code', action: 'Changelog'},
    {icon: 'how_to_vote', action: 'Voting', badge: 2},
  ]

  ngOnInit(): void {
    
    this.langSubscritpion$ = combineLatest([
      this.translate.onLangChange.pipe(
        map(event => event.lang),
        startWith(this.translate.currentLang)
      ), 
      this.newsSwitch$
    ])
    .pipe(
      switchMap(([lang, type]) => this.getNews(lang, type)  
    )).subscribe(news => this.news = news);

    this.carEventTypesSubscritpion$ = this.events.getEventTypes().subscribe(types => {
      this.carEventTypes = types;
    })

  }

  ngOnDestroy(): void {
    this.langSubscritpion$.unsubscribe();
    this.carEventTypesSubscritpion$.unsubscribe();
    
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

  prepareChart(): void {

    this.summaryChartConfig$ = this.mainCar$.pipe(
      switchMap(car => car ? this.events.getSummary(car.id) : of({})),
      map(summary => {
        const keys = Object.keys(summary);
        const months = keys.map(key => this.translate.instant(key[0].toUpperCase() + key.slice(1)));

        const events = {
          'pl.sztyro.carapp.model.RefuelEvent': '#76a773',
          'pl.sztyro.carapp.model.RepairEvent': '#cdb485',
          'pl.sztyro.carapp.model.InsuranceEvent': '#8c8cb1',
          'pl.sztyro.carapp.model.TireChangeEvent': '#c0c0c0',
        }

        return {
          type: 'bar',
          data:{
            labels: months,
            datasets: Object.keys(events).map(eventType => {
              return {
                label: this.translate.instant(eventType + '.HEADER'),
                data: keys.map(month => summary[month]?.find(k => k.type === eventType)?.sum ?? 0),
                borderColor: events[eventType],
                backgroundColor: events[eventType],
                borderRadius: 8,
                maxBarThickness: 32,
                stack: 'costs'
              }
            }),
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
                  return `${context.dataset.label}: ${Number(context.raw).toFixed(2)} zł`; 
                }
              }
            }
          },
          }
        }
      })
    )
    
  }

  switchAction(index: number): void {
    let next = index + 1;
    if(this.newsActions.length === next) this.newsSwitch$.next(this.newsActions[0].action)
    else this.newsSwitch$.next(this.newsActions[next].action)
  }

}
