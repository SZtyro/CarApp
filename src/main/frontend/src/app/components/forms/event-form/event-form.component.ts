import { Component } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { CarService } from 'src/app/services/car.service';
import { Validators } from '@angular/forms';
import { FuelSummary } from '../../fuel-summary/fuel-summary.component';
import { BaseFormComponent, BaseRestService, Div, TileSelect, InputField, DateField, ChipsField, TextareaField, ImageField } from '@sztyro/core';
import { InsuranceCompanyService } from 'src/app/services/insurance-company.service';
import { TireService } from '../tire/tire.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.html',
  styleUrls: ['./../../../../../node_modules/@sztyro/core/src/lib/assets/base-form.component.scss'],
})
export class EventFormComponent extends BaseFormComponent<any>{
  override resource: BaseRestService<any> = this.injector.get(EventService);
  private cars: CarService = this.injector.get(CarService);
  private tires: TireService = this.injector.get(TireService);
  private insuranceCompanies: InsuranceCompanyService = this.injector.get(InsuranceCompanyService);

  override fields = [
    // Div.create( 'container-fluid',
      Div.tile(null, 'row',
        Div.create(() => {return {"col-md-6": this.isRefuelEvent()}},
          Div.create("row",
            InputField.create({ path: 'mileage', options: { 
              type: 'number',
              isRequired: () => !this.isDateInFuture(),
              label: 'pl.sztyro.carapp.model.CarEvent.mileage'
            }}),
            InputField.create({ path: 'amountOfFuel', options: {
              suffix:'l' ,
              type: 'number',
              isRequired: () => this.isRefuelEvent(),
              class: () => {return {'col-lg-6' : this.isRefuelEvent(), 'd-none': !this.isRefuelEvent()}}} 
            }),
            InputField.create({ path: 'price', options: {
              suffix:'zł',
              type: 'number',
              isRequired: () => this.object.type == 'Refuel',
              class: {'col-lg-6': true},
              label: 'pl.sztyro.carapp.model.CarEvent.price'
            }}),
            DateField.create({path: 'date', options: { 
              class: () => {return {'col-md-6': !this.isRefuelEvent()}},
              validators: [Validators.required],
              label: 'pl.sztyro.carapp.model.CarEvent.date'
            }}),
            ChipsField.restPicker(this.insuranceCompanies,{path: "company", options: {
              class: 'col-md-6',
              isHidden: () => this.object.entityType != "pl.sztyro.carapp.model.InsuranceEvent"
            }}),
            ImageField.create({path: 'company.logoUrl', options: { 
              class: 'col-md-6',
              height: '82',
              isHidden: () => this.object.entityType != "pl.sztyro.carapp.model.InsuranceEvent"
            }}),
            ChipsField.restPicker(this.cars,{path: "car", options: {
              label: 'pl.sztyro.carapp.model.CarEvent.car'
            }}),
            ChipsField.restPicker(this.tires,{path: "tires", options: {
              
            }}),
          )
        ),
        Div.create(() => {return {"col-md-6": true, 'd-none': !this.isRefuelEvent()}},
          FuelSummary.create({path: null, options: {isHidden: () => !this.isRefuelEvent()}})
        ),
        Div.create("col-12",
          TextareaField.create({path: 'remarks', options:{ label: 'pl.sztyro.carapp.model.CarEvent.remarks' }}),
          Div.create("row",
            ChipsField.create({ path: "previousEvent", options: {
              class: 'col-6', 
              restpicker: Object.assign(this.resource.defaultRestpickerOptions, {
                showValue: e => new Date(e.date).toLocaleDateString()
              }),
              label: 'pl.sztyro.carapp.model.CarEvent.previousEvent'
            }}),
            ChipsField.create({ path: "nextEvent", options: {
              class: 'col-6', 
              restpicker: Object.assign(this.resource.defaultRestpickerOptions, {
                showValue: e => new Date(e.date).toLocaleDateString()
              }),
              label: 'pl.sztyro.carapp.model.CarEvent.nextEvent'
            }}),  
          
          )
        )
      )
    // ),
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
