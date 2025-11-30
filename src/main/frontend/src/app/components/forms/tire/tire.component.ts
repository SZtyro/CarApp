import { Component, inject } from '@angular/core';
import { ActionButton, StandardFormComponent, FormElementBuilder, FieldBuilder, formImports } from '@sztyro/core';
import { TireService } from './tire.service';
import { TireModelService } from '../tire-model/tire-model.service';
import { mergeMap, Observable, of } from 'rxjs';

@Component({
  selector: 'app-tire',
  standalone: true,
  imports: [formImports],
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.scss'],
})
export class TireComponent extends StandardFormComponent {
  override resource = inject(TireService);
  private models = inject(TireModelService);


  override actionButtons: ActionButton[] = [
    ActionButton.of(b => b.name('Generate others').iconContent('control_point_duplicate').click(() => {
      this.resource.getEnum("pl.sztyro.carapp.enums.TirePlacement").pipe(
        mergeMap(placements => placements),
        mergeMap(placement => placement['name'] !== this.object().placement ? this.createCopy(placement['name']) : of())  
      ).subscribe(() => this.interaction.defaultMessage('Successfully generated'), err => this.interaction.defaultError(err))
    }))
  ];

  private createCopy(placement: string): Observable<any>{
    let body: any= {...this.object};
    body.placement = placement;
    delete body.id;
    return this.resource.create(body)
  }

  protected override template(builder: FieldBuilder): FormElementBuilder<any>[] {
    return [
      builder.tile(t => [
        t.input('model').display(e => e.name).restPicker(this.models).build(),
        t.input('tireWidth'),
        t.input('aspectRatio'),
        t.input('diameter'),
        t.input('loadRating'),
        t.input('speedRating'),
        t.date('date'),
        t.select('placement').optionsFromEnum('pl.sztyro.carapp.enums.TirePlacement')
      ]).class('row')
    ]
  }

}
