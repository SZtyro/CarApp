import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export const searchTemplatePath = './tools/base-search/base-search.component.html'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  mobileView:boolean = false;
  hideMenu:boolean = true;
  hideMennuPaths: string[] = ['/home', '/login'];

  constructor(
    private router: Router,
    private translate: TranslateService
  ){}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobileView = event.target.innerWidth > 576;
  }

  menu = [
    {name: 'Dashboard', icon: 'home', path: 'dashboard'},
    {name: 'pl.sztyro.carapp.model.Car.HEADER$plural', icon: 'directions_car', path: 'Cars'},
    {name: 'pl.sztyro.carapp.model.CarEvent.HEADER$plural', icon: 'list_alt', path: 'Events'},
    // {name: 'Settings', icon: 'settings'},
    {name: 'pl.sztyro.carapp.model.InsuranceCompany.HEADER$plural', icon: 'apartment', path: 'InsuranceCompanies'},
    {name: 'pl.sztyro.carapp.model.TireCompany.HEADER$plural', icon: 'emoji_transportation', path: 'TireCompanies'},
    {name: 'pl.sztyro.carapp.model.TireModel.HEADER$plural', icon: 'stars', path: 'TireModels'},
    {name: 'pl.sztyro.carapp.model.Tire.HEADER$plural', icon: 'radio_button_unchecked', path: 'Tires'},
    {name: 'pl.sztyro.core.model.Role.HEADER$plural', icon: 'settings', path: 'Roles'},
  ]

  ngOnInit(): void {

    let lang = localStorage.getItem('language')
    if(lang == null) lang =  navigator.language.replace("-","_"); 

    this.translate.use(lang);

    this.translate.onLangChange.subscribe(v => {
      localStorage.setItem('language', v.lang);
    })

    this.mobileView = window.innerWidth > 576;

    
    this.router.events.subscribe(event => {
      this.hideMenu = this.hideMennuPaths.find(elem =>  elem === window.location.pathname) != null ;
    })
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
