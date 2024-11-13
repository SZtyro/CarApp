import { NgModule, Type } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventFormComponent } from './components/forms/event-form/event-form.component';
import { EventService } from './services/event.service';
import { CarService } from './services/car.service';
import { CarFormComponent } from './components/forms/car-form/car-form.component';
import { BaseFormComponent, BaseRestService, BaseSearchComponent, RESOURCE, RoleComponent, RoleService, ProfileService} from '@sztyro/core';



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
      { path: 'Events', children: getChildren(EventFormComponent, EventService) },
      { path: 'pl.sztyro.carapp.model.CarEvent', redirectTo: 'Events' },
      { path: 'pl.sztyro.carapp.model.Car', redirectTo: 'Cars' },
      { path: 'Cars', children: getChildren(CarFormComponent, CarService) },
      { path: 'Roles', children: getChildren(RoleComponent, RoleService) },
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
