import { Component } from '@angular/core';
import { BaseFormComponent, BaseRestService, Div, GeneratorProperties, InputField } from '@sztyro/core';
import { InsuranceCompanyService } from 'src/app/services/insurance-company.service';

@Component({
  selector: 'app-insurance-company',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.scss'],
})
export class InsuranceCompanyComponent extends BaseFormComponent {
  override resource: InsuranceCompanyService = this.injector.get(InsuranceCompanyService);

  override fields: GeneratorProperties<any>[] = [
    Div.tile('', 'row',
      InputField.create({path: 'name', options: {class: 'col-md-6'}}),
      // CheckboxField.create({path: 'enabled', options: {class: 'col-md-6'}})
      InputField.create({path: 'logoUrl', options: {class: 'col-12'}})
    )
    
  ];
}
