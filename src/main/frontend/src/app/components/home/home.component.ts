import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(public translate: TranslateService){

  }

  roadmap = [
    { title: 'Core', description: 'Form builder, core utilities, fields', done: true, library: true },
    { title: 'Events', description: 'Refueling, cost summary, repairs, insurance', done: true },
    { title: 'Tires', description: 'Tire changes, brands, models', done: true },
    { title: 'App dashboard', description: 'Detailed statistics and insights', done: false },
    { title: 'Menu', description: 'Expandable menu with a tree structure', done: false, library: true },
    { title: 'Welcome page', description: 'Public page for non-logged users', done: false },
    { title: 'Task system', description: 'Bug reporting and development tracking', done: false, library: true },
    { title: 'Rating', description: 'Tire rating and reviews', done: false },
    { title: 'Community', description: 'User forums', done: false },
];


  technologies = [
    { title: 'Java', logo: 'https://www.svgrepo.com/show/303388/java-4-logo.svg', background: '#bd610e'},
    { title: 'Spring boot', logo: 'https://www.svgrepo.com/show/376350/spring.svg', background: '#70ad51'},
    { title: 'Angular', logo: 'https://www.svgrepo.com/show/452156/angular.svg', background: '#dd0031'},
    { title: 'Typescript', logo: 'https://www.svgrepo.com/show/349540/typescript.svg', background: '#3178c6'},
    { title: 'RxJs', logo: 'https://cdn.worldvectorlogo.com/logos/rxjs-1.svg', background: '#bf2386'},
    { title: 'Bootstrap', logo: 'https://www.svgrepo.com/show/353498/bootstrap.svg', background: '#563d7c'},
    { title: 'Postgres', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/540px-Postgresql_elephant.svg.png', background: '#336a94'},
    { title: 'Docker', logo: 'https://www.svgrepo.com/show/452192/docker.svg', background: '#1794d4'},
    { title: 'Git', logo: 'https://www.svgrepo.com/show/452210/git.svg', background: '#ee513b'},
    { title: 'Maven', logo: 'https://www.svgrepo.com/show/373829/maven.svg', background: '#e87427'},
    { title: 'Tomcat', logo: 'https://www.svgrepo.com/show/354454/tomcat.svg', background: '#d1a41a'},
    { title: 'Linux', logo: 'https://www.svgrepo.com/show/452122/ubuntu.svg', background: '#e95420'},
  ]

  changeLanguage(){
    let l = this.translate.currentLang;
    if(l == 'en_US') this.translate.use('pl_PL');
    else this.translate.use('en_US');
  }
}
