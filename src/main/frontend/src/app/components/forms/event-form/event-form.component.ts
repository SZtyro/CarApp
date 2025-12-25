import { Component, inject } from "@angular/core";
import { EventService } from "src/app/services/event.service";
import { CarService } from "src/app/services/car.service";
import { FuelSummary } from "../../fuel-summary/fuel-summary.component";
import {
  BaseRestService,
  RestPickerComponent,
  StandardFormComponent,
  FieldBuilder,
  FormElementBuilder,
} from "@sztyro/core";
import { InsuranceCompanyService } from "src/app/services/insurance-company.service";
import { TireService } from "../tire/tire.service";
import { EventConnectionBuilder, EventConnectionComponent } from "./event-connection.component";
import { FormControl, FormGroup } from "@angular/forms";
import { InputComponent } from "@sztyro/core/lib/form-builder/field/input.component";

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

  override onFormReady(): void {
    super.onFormReady();
    ["mileage", "date", "price", "car", "remarks"].forEach((path) => {
      this.getFieldByPath<InputComponent>(path).getLabel = () => `pl.sztyro.carapp.model.CarEvent.${path}`;
    });
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
    let formDate = new Date(this.object()?.date);
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
          t.date("date").class("col-md-6").required(),
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
