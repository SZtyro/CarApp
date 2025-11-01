import { Component, inject } from '@angular/core';
import { BaseRestService, StandardFormComponent, FieldBuilder, FormElementBuilder } from '@sztyro/core';
import { CarService } from 'src/app/services/car.service';
import { InsuranceSummaryBuilder, InsuranceSummaryComponent } from '../../insurance-summary/insurance-summary.component';
import { TireSummaryBuilder, TireSummaryComponent } from '../../tire-summary/tire-summary.component';
import { CarTimelineComponent } from '../../car-timeline/car-timeline.component';

@Component({
  selector: 'app-car-form',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.html',
  styleUrls: [
    './../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.scss'
  ]
})
export class CarFormComponent extends StandardFormComponent {
  
  override resource: BaseRestService<any> = inject(CarService);
  
  protected override template(builder: FieldBuilder): FormElementBuilder<any>[] {
    return [
      builder.standardTile(tile => [
        tile.input('name').required().class('col-md-6'),
        tile.select('engineType').class('col-md-6').optionsFromEnum('pl.sztyro.carapp.enums.EngineType')
      ]),
      builder.customAsTile<InsuranceSummaryBuilder>(InsuranceSummaryComponent, b => b.carId(this.object().id))
        .class('col-xxl-4')
        .ripple(),
      builder.customAsTile<TireSummaryBuilder>(TireSummaryComponent, b => b.carId(this.object().id))
        .class('col-xxl-8'),
      builder.customAsTile<TireSummaryBuilder>(CarTimelineComponent, b => b.carId(this.object().id))
        .class('col-12')
    ]
  }
   
}
