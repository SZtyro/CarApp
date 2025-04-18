import { Component } from '@angular/core';
import { PwaService } from '@sztyro/core';

export const searchTemplatePath = './tools/base-search/base-search.component.html'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {

  constructor(private pwa: PwaService){

    
  }
  

}
