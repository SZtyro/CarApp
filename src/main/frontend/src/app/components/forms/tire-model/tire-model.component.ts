import { Component, inject } from '@angular/core';
import { FieldBuilder, StandardFormComponent, FormElementBuilder } from '@sztyro/core';
import { TireModelService } from './tire-model.service';
import { TireCompanyService } from 'src/app/services/tire-company.service';

@Component({
  selector: 'app-tire-model',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.scss'],
})
export class TireModelComponent extends StandardFormComponent{

  override resource = inject(TireModelService);
  private companies = inject(TireCompanyService);

  protected override template(builder: FieldBuilder): FormElementBuilder<any>[] {
      return [
        builder.standardTile(t => [
          t.input('name').class('col-md-6').required(),
          t.select('type').optionsFromEnum('pl.sztyro.carapp.enums.TireType').class('col-md-6').required(),
          t.input('company').dictionaryRestPicker(this.companies).build().class('col-md-6')
        ])
      ]
  }

}
