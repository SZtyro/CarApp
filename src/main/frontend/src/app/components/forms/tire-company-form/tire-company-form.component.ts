import { Component } from '@angular/core';
import { BaseFormComponent, Div, GeneratorProperties, InputField } from '@sztyro/core';
import { TireCompanyService } from 'src/app/services/tire-company.service';

@Component({
  selector: 'app-tire-company-form',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.scss'],
})
export class TireCompanyFormComponent extends BaseFormComponent {
  override resource: TireCompanyService = this.injector.get(TireCompanyService);
  override getProperties(): GeneratorProperties<any>[] {
    return [
      Div.tileStandard(
        InputField.create({path: 'name', options: {class: 'col-md-6'}}),
        // CheckboxField.create({path: 'enabled', options: {class: 'col-md-6'}})
        InputField.create({path: 'logoUrl', options: {class: 'col-12'}})
      )
        
      
      
    ]
  }
}
