import { Component } from '@angular/core';

export const searchTemplatePath = './tools/base-search/base-search.component.html'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menu = [
    {name: 'Dashboard', icon: 'home', path: 'dashboard'},
    {name: 'Cars', icon: 'directions_car', path: 'cars'},
    {name: 'Events', icon: 'list_alt', path: 'events'},
    {name: 'Settings', icon: 'settings'},
  ]
}
