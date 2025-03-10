import { Component } from '@angular/core';
import { ActionButton, BaseFormComponent, BaseRestService, ChipsField, DateField, Div, GeneratorProperties, InputField, SelectField, SelectOption } from '@sztyro/core';
import { TireService } from './tire.service';
import { TireModelService } from '../tire-model/tire-model.service';
import { map, mergeMap, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-tire',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.scss'],
})
export class TireComponent extends BaseFormComponent {
  override resource = this.injector.get(TireService);
  private models = this.injector.get(TireModelService);


  override actionButtons: ActionButton[] = [
    ActionButton.of(b => b.name('Generate others').iconContent('control_point_duplicate').click(() => {
      this.resource.getEnum("pl.sztyro.carapp.enums.TirePlacement").pipe(
        mergeMap(placements => placements),
        mergeMap(placement => placement['name'] !== this.object.placement ? this.createCopy(placement['name']) : of())  
      ).subscribe(() => this.interaction.defaultMessage('Successfully generated'), err => this.interaction.defaultError(err))
    }))
  ];

  private createCopy(placement: string): Observable<any>{
    let body: any= {...this.object};
    body.placement = placement;
    delete body.id;
    return this.resource.create(body)
  }

  override getProperties(): GeneratorProperties<any>[] {
    return [
      Div.tile(null, 'row',
        ChipsField.restPicker(this.models, {path: 'model', options: {}}),
        InputField.create({path: 'tireWidth', options: {class: 'col-md-4'}}),
        InputField.create({path: 'aspectRatio', options: {class: 'col-md-4'}}),
        InputField.create({path: 'diameter', options: {class: 'col-md-4'}}),
        InputField.create({path: 'loadRating', options: {class: 'col-md-4'}}),
        InputField.create({path: 'speedRating', options: {class: 'col-md-4'}}),
        DateField.create({path: 'date', options: {class: 'col-md-4'}}),
        SelectField.create({path: 'placement', options: {
          class: 'col-md-4', 
          selectOptions: this.resource.getEnum("pl.sztyro.carapp.enums.TirePlacement").pipe(
            map(e => e.map(x => new SelectOption(x.name)))
          )
        }}),
      )
    ]
  }
}
