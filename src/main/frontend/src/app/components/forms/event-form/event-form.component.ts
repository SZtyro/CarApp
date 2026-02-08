import { Component, computed, inject, signal, Signal, WritableSignal } from "@angular/core";
import { EventService } from "src/app/services/event.service";
import { CarService } from "src/app/services/car.service";
import { FuelSummary } from "../../fuel-summary/fuel-summary.component";
import {
  BaseRestService,
  RestPickerComponent,
  StandardFormComponent,
  FieldBuilder,
  FormElementBuilder,
  SelectOption,
  FormField,
} from "@sztyro/core";
import { InsuranceCompanyService } from "src/app/services/insurance-company.service";
import { TireService } from "../tire/tire.service";
import { EventConnectionBuilder, EventConnectionComponent } from "./event-connection.component";
import { FormControl, FormGroup } from "@angular/forms";
import { InputComponent } from "@sztyro/core/lib/form-builder/field/input.component";
import { DateComponent } from "@sztyro/core/lib/form-builder/field/date.component";
import { SelectComponent } from "@sztyro/core/lib/form-builder/field/select.component";

@Component({
  selector: "app-event-form",
  templateUrl: "./../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.html",
  styleUrls: [
    "./../../../../../node_modules/@sztyro/core/src/lib/assets/form.component.scss",
    "./event-form.component.scss",
  ],
})
export class EventFormComponent extends StandardFormComponent {
  override resource: BaseRestService<any> = inject(EventService);
  private cars: CarService = inject(CarService);
  private tires: TireService = inject(TireService);
  private insuranceCompanies: InsuranceCompanyService = inject(InsuranceCompanyService);

  private transitionedEvent: boolean = false;
  private formDate: WritableSignal<Date> = signal(new Date());

  private readonly NOTIFICATION_LABEL = "Notification";

  override onFormReady(): void {
    super.onFormReady();

    ["mileage", "date", "price", "car", "remarks"].forEach((path) => {
      this.getFieldByPath<InputComponent>(path).getLabel = () => `pl.sztyro.carapp.model.CarEvent.${path}`;
    });

    let notificationField = this.getFieldByPredicate<SelectComponent>(e => e.getLabel?.() === this.NOTIFICATION_LABEL);
    let fireDate = this.object()['fireDate'];


    if(notificationField != null && fireDate != null) {
      let dateEvent: Date = new Date(this.object()['date']);
      let dateParts: number[] = fireDate.split("-").map(Number);

      let day = dateParts[2];
      let month = dateParts[1];
      let year = dateParts[0];

      const utcA = Date.UTC(year, month - 1, day)
      const utcB = Date.UTC(dateEvent.getFullYear(), dateEvent.getMonth(), dateEvent.getDate());

      let diff = Math.round((utcB - utcA) / (1000 * 60 * 60 * 24)) - 1;
      notificationField.options$.subscribe(options => {
        let option = options.find(o => o.value === diff);

        setTimeout(() => {
          notificationField.setValue(option.value);
        }, 0);
      })
    }
  }

  override getImportantInfo() {
    let now = new Date();
    now.setHours(0, 0, 0);
    if (this.object()?.date > now.getTime() && this.isRefuelEvent()) return "TIPS.REFUELING";
    else return null;
  }

  isRefuelEvent() {
    return this.object()?.entityType === "pl.sztyro.carapp.model.RefuelEvent";
  }

  isDateInFuture(): boolean {
    let formDate = this.formDate();
    let now = new Date();
    now.setHours(23, 59, 59);
    return formDate.getTime() >= now.getTime();
  }

  protected override template(builder: FieldBuilder): FormElementBuilder<any>[] {
    return [
      builder
        .standardTile((t) => [
          t.input("mileage").type("number").class("col-md-6").isRequired(() => !this.isDateInFuture()),
          t.select("careType").optionsFromEnum("pl.sztyro.carapp.enums.CarCareType").class("col-md-6").isHidden(() => !this.isCareEvent()),
          t.input("amountOfFuel").type("number").suffix("l").class("col-md-6").isRequired(() => this.isRefuelEvent()).isHidden(() => !this.isRefuelEvent()),
          t.input("price").type("number").suffix("zł").class("col-md-6").isRequired(() => this.isRefuelEvent()),
          t.input("timeSpent").type("number").suffix("min").class("col-md-6").isHidden(() => !this.isCareEvent()),
          t.date("date").class("col-md-6").required().onChange((value) => {
            this.formDate.update(() => new Date(value));
            let notificationField = this.getFieldByPredicate<DateComponent>(f => f.getLabel?.() === this.NOTIFICATION_LABEL);

            if(value != this.object()['date'] && !this.isRefuelEvent()){ // Date changed, reset notification
              notificationField.setValue(null);
              this.update("fireDate", null);
            }
          }),
          t.input("company").class("col-md-6").isHidden(() => !this.isInsuranceEvent()).dictionaryRestPicker(this.insuranceCompanies).build(),
          t.image("company.logoUrl").class("col-md-6").height("82").isHidden(() => !this.isInsuranceEvent()),
          t.input("car").class({"col-md-6": !this.isRefuelEvent()}).required().dictionaryRestPicker(this.cars).build(),
          t.chips("tires").required().showValue((e) => e["entityDescription"]).dictionaryRestPicker(this.tires).build().isHidden(() => !this.isTireEvent()),
        ])
        .class({ "col-md-6 x": this.isRefuelEvent() }),
      builder
        .custom(FuelSummary)
        .class({ "col-md-6": this.isRefuelEvent(), "d-none": !this.isRefuelEvent() }),
      builder.standardTile((t) => [t.textarea("remarks")]),
      this.notificationSetction(builder),
      builder
        .custom<EventConnectionBuilder>(EventConnectionComponent)
        .path("previousEvent")
        .class("col-6"),
      builder
        .custom<EventConnectionBuilder>(EventConnectionComponent)
        .path("nextEvent")
        .class("col-6"),
    ];
  }

  private notificationSetction(builder: FieldBuilder): FormElementBuilder<any> {
    return  builder.standardTile(t => [
      t.select()
        .class('col-12')
        .label(this.NOTIFICATION_LABEL)
        .labelPrefix("")
        .onChange((selectedOption:SelectOption) => {

          if(selectedOption){

            let eventDate = new Date(this.object().date);
            let dayOfMonth = eventDate.getDate();

            eventDate.setDate(dayOfMonth - selectedOption.value);

            this.update("fireDate",  eventDate.toISOString().substring(0, 10));
          }
        })
        .options([
          new SelectOption("1_day_before", 1),
          new SelectOption("3_days_before", 3),
          new SelectOption("7_days_before", 7),
          new SelectOption("14_days_before", 14),
          new SelectOption("30_days_before", 30)
        ])
    ]).isHidden(() => !this.isDateInFuture())
  }



  navigateToEvent(type: "previous" | "next", eventId: string) {
    this.transitionedEvent = true;
    let elem = document.getElementsByTagName("app-event-form");
    elem.item(0).classList.add(type);
    setTimeout(() => {
      let entityType = this.object().entityType;
      if (!entityType) throw new Error("EntityType not found");
      if (!eventId) throw new Error("EventId not found");
      this.router.navigate(["Events", entityType, eventId]).then(() => {
        elem.item(0).classList.remove(type);
      });
    }, 500);
  }

  editPreviousEvent(): void {
    this.interaction
      .openRestPicker(RestPickerComponent, {
        ...this.resource.defaultRestpickerOptions,
        customMethod: (params) => {
          let p = { ...params };
          p["id"] = "!" + this.object().id;
          p.entityType = this.object().entityType;
          return this.resource.getAll(p);
        },
      })
      .subscribe((selected: unknown) => {
        if (selected) {
          this.object().previousEvent = selected;
        }
      });
  }

  clearPreviousEvent(): void {
    this.object().previousEvent = null;
  }

  override returnToList(): void {
    if (this.transitionedEvent) this.router.navigate(["Events"]);
    else super.returnToList();
  }

  isCareEvent(): boolean {
    return this.object().entityType == "pl.sztyro.carapp.model.CarCareEvent";
  }

  isInsuranceEvent(): boolean {
    return this.object().entityType == "pl.sztyro.carapp.model.InsuranceEvent";
  }

  isTireEvent(): boolean {
    return this.object().entityType == "pl.sztyro.carapp.model.TireEvent";
  }

  override beforeSave(object: unknown): unknown {
    if (!this.isCareEvent()) {
      delete object["careType"];
      delete object["timeSpent"];
    }
    if (!this.isTireEvent()) delete object["tires"];
    if (!this.isRefuelEvent()) delete object["amountOfFuel"];
    return object;
  }
}
