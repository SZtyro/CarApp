import { Component } from '@angular/core';
import { BaseFormComponent, ChipsField, Div, GeneratorProperties, InputField, SelectField } from '@sztyro/core';
import { TireModelService } from './tire-model.service';
import { TireCompanyService } from 'src/app/services/tire-company.service';

@Component({
  selector: 'app-tire-model',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.scss'],
})
export class TireModelComponent extends BaseFormComponent<any>{

  override resource = this.injector.get(TireModelService);
  private companies = this.injector.get(TireCompanyService);
  override getProperties(): GeneratorProperties<any>[] {
      return [
        Div.tileStandard(
          InputField.create({path: 'name', options:{ class: 'col-md-6'}}),
          SelectField.fromEnum({path: 'type', options: {
            class: 'col-md-6',
            resource: this.resource,
            isRequired: () => true,
            enumType: "pl.sztyro.carapp.enums.TireType"
          }}),
          ChipsField.restPicker(this.companies, {path: 'company', options: {}}),
        
        )
    
      ]
  }

}
