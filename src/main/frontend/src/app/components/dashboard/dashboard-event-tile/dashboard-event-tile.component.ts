import { CommonModule } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, Signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-dashboard-event-tile',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './dashboard-event-tile.component.html',
  styleUrl: './dashboard-event-tile.component.scss'
})
export class DashboardEventTileComponent implements OnInit, OnDestroy{

  private carEventTypes: object = {};
  private carEventTypesSubscritpion$: Subscription;
  private events = inject(EventService);

  event: any = input.required();
  carName: Signal<string> = input.required<string>();

  ngOnInit(): void {
    this.carEventTypesSubscritpion$ = this.events.getEventTypes().subscribe(types => {
      this.carEventTypes = types;
    })
  }

  ngOnDestroy(): void {
    this.carEventTypesSubscritpion$.unsubscribe();

  }

  getIconFor?(type){
    return this.carEventTypes[type];
  }
}
