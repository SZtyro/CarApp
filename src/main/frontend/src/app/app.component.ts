import { Component } from '@angular/core';
import { MenuService, PwaService } from '@sztyro/core';
import { map } from 'rxjs';

export const searchTemplatePath = './tools/base-search/base-search.component.html'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {

  constructor(private pwa: PwaService, private menu: MenuService){
    this.menu.registerPipe(map(menu => {
      return [{name: 'Dashboard', icon: 'home', path: 'dashboard'}, ...menu]
    }))
    
  }
  

}
