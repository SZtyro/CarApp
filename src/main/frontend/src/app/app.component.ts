import { Component, HostListener, OnInit } from '@angular/core';

export const searchTemplatePath = './tools/base-search/base-search.component.html'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  mobileView:boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobileView = event.target.innerWidth > 576;
  }

  menu = [
    {name: 'Dashboard', icon: 'home', path: 'dashboard'},
    {name: 'pl.sztyro.carapp.model.Car.HEADER$plural', icon: 'directions_car', path: 'Cars'},
    {name: 'pl.sztyro.carapp.model.CarEvent.HEADER$plural', icon: 'list_alt', path: 'Events'},
    // {name: 'Settings', icon: 'settings'},
    {name: 'pl.sztyro.core.model.Role.HEADER$plural', icon: 'settings', path: 'Roles'},
  ]

  ngOnInit(): void {
    this.mobileView = window.innerWidth > 576;
  }

  getCurrentPath(): string{
    return location.pathname.slice(1)
  }

  isServeEnabled(): boolean{
    return (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
      && location.port === '4200';
  }

  getDevelopHref(): string{
    return location.href.replace(':8080', ':4200')
  }

}
