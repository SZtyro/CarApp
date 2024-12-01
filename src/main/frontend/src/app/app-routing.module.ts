import { NgModule, Type } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventFormComponent } from './components/forms/event-form/event-form.component';
import { EventService } from './services/event.service';
import { CarService } from './services/car.service';
import { CarFormComponent } from './components/forms/car-form/car-form.component';
import { BaseFormComponent, BaseRestService, BaseSearchComponent, RESOURCE, RoleComponent, RoleService, ProfileService} from '@sztyro/core';
import { EventComponent } from './components/forms/event-form/event.component';
import { InsuranceCompanyService } from './services/insurance-company.service';
import { InsuranceCompanyComponent } from './components/forms/insurance-company/insurance-company.component';



let getChildren = (
  form: Type<BaseFormComponent<any>>,
  service: Type<BaseRestService<any>>,
  ...children: Routes
) => {
  return [
    {
      path: '',
      component: BaseSearchComponent,
      providers: [{ provide: RESOURCE, useClass: service }],
    },
    {
      path: ':id',
      component: form,
      resolve: { model: service },
    },
    ...children,
  ];
};

const routes: Routes = [
  {
    path: '',
    resolve: { profile: ProfileService },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'Events', children: [
        { path: "", component: EventComponent, providers: [{ provide: RESOURCE, useClass: EventService }] },
        { path: ":id", component: EventFormComponent, resolve: { model: EventService} },
      ]},
      { path: 'pl.sztyro.carapp.model.CarEvent', redirectTo: 'Events' },
      { path: 'pl.sztyro.carapp.model.TireChangeEvent', redirectTo: 'Events' },
      { path: 'pl.sztyro.carapp.model.RepairEvent', redirectTo: 'Events' },
      { path: 'pl.sztyro.carapp.model.InsuranceEvent', redirectTo: 'Events' },
      { path: 'pl.sztyro.carapp.model.Car', redirectTo: 'Cars' },
      { path: 'Cars', children: getChildren(CarFormComponent, CarService) },
      { path: 'Roles', children: getChildren(RoleComponent, RoleService) },
      { path: 'InsuranceCompanies', children: getChildren(InsuranceCompanyComponent, InsuranceCompanyService) },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
