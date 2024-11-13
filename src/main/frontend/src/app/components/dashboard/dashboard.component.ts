import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { FilteredResult, RoleService } from '@sztyro/core'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  private carEventTypes: any[];

  constructor(private events: EventService, private roles: RoleService) { }



  today: Date = new Date();
  incomingEvents$: Observable<FilteredResult<any>> = this.events.getAll({
    max: 5,
    "sort": 'date:ASC',
    'date:From': this.today.getTime(),
  });

  ngOnInit(): void {
    this.roles.current().subscribe(console.log)
    this.events.getEnum('pl.sztyro.carapp.enums.CarEventType').subscribe(events => {
      this.carEventTypes = events;

    })
  }

  getIconFor?(type){
    return this.carEventTypes?.find(e => e.name == type)?.icon;
  }
}
