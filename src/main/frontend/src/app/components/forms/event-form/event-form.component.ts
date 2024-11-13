import { Component } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { CarService } from 'src/app/services/car.service';
import { Validators } from '@angular/forms';
import { FuelSummary } from '../../fuel-summary/fuel-summary.component';
import { BaseFormComponent, BaseRestService, Div, TileSelect, InputField, DateField, ChipsField, TextareaField } from '@sztyro/core';

@Component({
  selector: 'app-event-form',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.scss'],
})
export class EventFormComponent extends BaseFormComponent<any>{
  override resource: BaseRestService<any> = this.injector.get(EventService);
  private cars: CarService = this.injector.get(CarService);

  override fields = [
    Div.create( 'container-fluid',
      Div.create('row',
        Div.create(() => {return {"col-md-6": this.isRefuelEvent()}},
          Div.create("row",
            TileSelect.create({ path: 'type', options: { selectOptions: this.resource.getEnum('pl.sztyro.carapp.enums.CarEventType'), afterChanged: () => this.updateFormValidity()}}),
            InputField.create({ path: 'mileage', options: { type: 'number', isRequired: () => !this.isDateInFuture() } }),
            InputField.create({ path: 'amountOfFuel', options: {suffix:'l' , type: 'number', isRequired: () => this.isRefuelEvent(), class: () => {return {'col-lg-6' : this.isRefuelEvent(), 'd-none': !this.isRefuelEvent()}}} }),
            InputField.create({ path: 'price', options: {suffix:'zł', type: 'number', isRequired: () => this.object.type == 'Refuel', class: {'col-lg-6': true} }}),
            DateField.create({path: 'date', options: { class: () => {return {'col-md-6': !this.isRefuelEvent()}}, validators: [Validators.required]}}),
            ChipsField.restPicker(this.cars,{path: "car", options: {class: 'col-12'}}),
          )
        ),
        Div.create(() => {return {"col-md-6": true, 'd-none': !this.isRefuelEvent()}},
          FuelSummary.create({path: null, options: {isHidden: () => !this.isRefuelEvent()}})
        ),
        Div.create("col-12",
          TextareaField.create({path: 'remarks'}),
          Div.create("row",
            ChipsField.create({ path: "previousEvent", options: {class: 'col-6', restpicker: Object.assign(this.resource.defaultRestpickerOptions, {showValue: e => new Date(e.date).toLocaleDateString()})}}),
            ChipsField.create({ path: "nextEvent", options: {class: 'col-6', restpicker: Object.assign(this.resource.defaultRestpickerOptions, {showValue: e => new Date(e.date).toLocaleDateString()})}}),  
          
          )
        )
      )
    ),
  ]



  isRefuelEvent(){
    return  this.object.type == 'Refuel';
  }

  isDateInFuture(): boolean{
    let formDate = new Date(this.object.date)
    let now = new Date()
    now.setHours(23,59,59)
    
    return formDate.getTime() >= now.getTime();
  }

  
}
