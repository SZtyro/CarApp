import { Component, inject } from '@angular/core';
import { FieldBuilder, FormComponent, FormElementBuilder } from '@sztyro/core';
import { TireCompanyService } from 'src/app/services/tire-company.service';

@Component({
  selector: 'app-tire-company-form',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.scss'],
})
export class TireCompanyFormComponent extends FormComponent {
  override resource: TireCompanyService = inject(TireCompanyService);

  protected override template(builder: FieldBuilder): FormElementBuilder<any>[] {
    return [
      builder.standardTile(t => [
        t.input('name').class('col-md-6'),
        t.checkbox('enabled').class('col-md-6'),
        t.input('logoUrl').class('col-12')
      ])
    ]
  }

}
