import { Component, inject } from '@angular/core';
import { FieldBuilder, StandardFormComponent } from '@sztyro/core';
import { FormElementBuilder } from '@sztyro/core/lib/form-builder/form-element';
import { InsuranceCompanyService } from 'src/app/services/insurance-company.service';

@Component({
  selector: 'app-insurance-company',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.scss'],
})
export class InsuranceCompanyComponent extends StandardFormComponent {
  protected override template(builder: FieldBuilder): FormElementBuilder<any>[] {
    return [
      builder.tile(anchor => [
        anchor.input('name').class('col-md-6').required(),
        anchor.checkbox('enabled').class('col-md-6'),
        anchor.input('logoUrl').class('col-12').required()
      ]).class('row'),
    ];
  }
  override resource: InsuranceCompanyService = inject(InsuranceCompanyService);
}


