import { Component } from '@angular/core';
import { searchTemplatePath } from 'src/app/app.component';
import { EventService } from 'src/app/services/event.service';
import { BaseSearchComponent } from 'src/app/tools/base-search/base-search.component';
import { Column } from 'src/app/tools/model/column';
import { TableOptions } from 'src/app/tools/model/tableOptions';

@Component({
  selector: 'app-event',
  templateUrl: `./../../${searchTemplatePath}`,
  styleUrls: [],
})
export class EventComponent extends BaseSearchComponent<any>{
  
  override service: EventService = this.injector.get(EventService);
  override tableOptions: TableOptions<any> = {
    columns: [
      Column.fromPath('name'),
      Column.fromPath('data'),
      new Column({header: 'Marka', getValue: (e) => e.car.name}),
      new Column({header: 'A', getValue: (e) => 'teeest'})
    ],
    redirectTo: row => `events/${row.id}`
  }
}
