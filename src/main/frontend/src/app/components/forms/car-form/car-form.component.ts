import { Component, inject } from '@angular/core';
import { BaseRestService, FormComponent, FieldBuilder } from '@sztyro/core';
import { CarService } from 'src/app/services/car.service';
import { FormElementBuilder } from '@sztyro/core/lib/form-builder/form-element';
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
export class CarFormComponent extends FormComponent {
  
  override resource: BaseRestService<any> = inject(CarService);
  
  protected override template(builder: FieldBuilder): FormElementBuilder<any>[] {
    return [
      builder.div(a => [
        a.div(a => [
          a.div(a => [
            a.tile(t => [
              t.input('name').required().class('col-md-6'),
              t.select('engineType').class('col-md-6').optionsFromEnum('pl.sztyro.carapp.enums.EngineType')
            ]),
            a.customAsTile<InsuranceSummaryBuilder>(InsuranceSummaryComponent, b => b.carId(this.object().id))
              .class('col-xxl-4')
              .ripple(),
            a.customAsTile<TireSummaryBuilder>(TireSummaryComponent, b => b.carId(this.object().id))
              .class('col-xxl-8'),
            a.customAsTile<TireSummaryBuilder>(CarTimelineComponent, b => b.carId(this.object().id))
              .class('col-xl-3 col-xxl-2')
          ]).class('row m-0')
        ]).class('col-xl-9 col-xxl-10 p-0')
      ]).class('row')
    ]
  }
   
}
