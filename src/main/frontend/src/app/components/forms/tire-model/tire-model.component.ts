import { Component } from '@angular/core';
import { BaseFormComponent, BaseRestService, ChipsField, Div, GeneratorProperties, InputField, SelectField, SelectOption } from '@sztyro/core';
import { TireModelService } from './tire-model.service';
import { TireCompanyService } from 'src/app/services/tire-company.service';
import { map } from 'rxjs';

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
        Div.tile(null, 'row', 
          InputField.create({path: 'name', options:{ class: 'col-md-6'}}),
          SelectField.create({path: 'type', options: {
            class: 'col-md-6',
            selectOptions: this.resource.getEnum("pl.sztyro.carapp.enums.TireType").pipe(map(e => e.map(x => new SelectOption(x.name))))
          }}),
          ChipsField.restPicker(this.companies, {path: 'company', options: {}}),
        
        )
    
      ]
  }

}
