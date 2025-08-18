import { NgModule, Type } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventFormComponent } from './components/forms/event-form/event-form.component';
import { EventService } from './services/event.service';
import { CarService } from './services/car.service';
import { CarFormComponent } from './components/forms/car-form/car-form.component';
import { MenuService, RESOURCE, RoleComponent, RoleService, ProfileService, LoginComponent, IssueService, IssueTypeService, IssueTypeComponent, IssueComponent} from '@sztyro/core';
import { EventComponent } from './components/forms/event-form/event.component';
import { InsuranceCompanyService } from './services/insurance-company.service';
import { InsuranceCompanyComponent } from './components/forms/insurance-company/insurance-company.component';
import { TireCompanyFormComponent } from './components/forms/tire-company-form/tire-company-form.component';
import { TireCompanyService } from './services/tire-company.service';
import { TireComponent } from './components/forms/tire/tire.component';
import { TireService } from './components/forms/tire/tire.service';
import { TireModelComponent } from './components/forms/tire-model/tire-model.component';
import { TireModelService } from './components/forms/tire-model/tire-model.service';
import { HomeComponent } from './components/home/home.component';
import { HomeService } from './services/home.service';


const routes: Routes = [
  { path: 'home', component: HomeComponent, resolve: {user: HomeService}},
  { path: 'login', component: LoginComponent},
  {
    path: '',
    resolve: { profile: ProfileService },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: "Events/:entityType/:id", component: EventFormComponent, resolve: { model: EventService} },
      { path: "Events/:type", component: EventComponent, providers: [{ provide: RESOURCE, useClass: EventService }], resolve: { metadata: EventService} },
      { path: 'Events', redirectTo: 'Events/All'},
      { path: 'pl.sztyro.carapp.model.CarEvent', redirectTo: 'Events' },
      { path: 'pl.sztyro.carapp.model.TireChangeEvent', redirectTo: 'Events' },
      { path: 'pl.sztyro.carapp.model.RepairEvent', redirectTo: 'Events' },
      { path: 'pl.sztyro.carapp.model.InsuranceEvent', redirectTo: 'Events' },
      { path: 'pl.sztyro.carapp.model.RepairEvent/:id', redirectTo: 'Events/pl.sztyro.carapp.model.RepairEvent/:id', resolve: {model: EventService} },
      { path: 'pl.sztyro.carapp.model.TireChangeEvent/:id', redirectTo: 'Events/pl.sztyro.carapp.model.TireChangeEvent/:id', resolve: {model: EventService} },
      { path: 'pl.sztyro.carapp.model.InsuranceEvent/:id', redirectTo: 'Events/pl.sztyro.carapp.model.InsuranceEvent/:id', resolve: {model: EventService} },
      { path: 'pl.sztyro.carapp.model.RefuelEvent/:id', redirectTo: 'Events/pl.sztyro.carapp.model.RefuelEvent/:id', resolve: {model: EventService} },
      { path: 'pl.sztyro.carapp.model.InsuranceCompany/:id', redirectTo: 'InsuranceCompanies/:id' },
      { path: 'pl.sztyro.carapp.model.Car', redirectTo: 'Cars' },
      { path: 'Cars', children: MenuService.getChildren(CarFormComponent, CarService) },
      { path: 'Roles', children: MenuService.getChildren(RoleComponent, RoleService) },
      { path: 'InsuranceCompanies', children: MenuService.getChildren(InsuranceCompanyComponent, InsuranceCompanyService)},
      { path: 'TireCompanies', children: MenuService.getChildren(TireCompanyFormComponent, TireCompanyService) },
      MenuService.standard('Tires', TireComponent, TireService),
      MenuService.standard('TireModels', TireModelComponent, TireModelService),
      MenuService.standard('IssueTypes', IssueTypeComponent, IssueTypeService),
      MenuService.standard('Issues', IssueComponent, IssueService),
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
