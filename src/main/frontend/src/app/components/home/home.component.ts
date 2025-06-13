import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService, Utils } from '@sztyro/core';
import { ChartConfiguration } from 'chart.js';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';

type wakaTimeData = {data: {color: string, name: string, percent: number}[]};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  @ViewChild('graphic') graphic: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event): void{
   
    this.screenWidth = event != null ? event.target.innerWidth : window.innerWidth;
    this.calculateRoadmapConfig()
  }

  yearLanguageChart$: Observable<ChartConfiguration> = this.http.get<wakaTimeData>('https://wakatime.com/share/@SZtyro/092cd836-97a4-421d-862a-3a93276b5ecb.json').pipe(
    map((s) => this.chartMapper(s))
  );
  weekLanguageChart$: Observable<ChartConfiguration> = this.http.get<wakaTimeData>('https://wakatime.com/share/@SZtyro/a5b93562-f28b-478a-b83e-5eda37cae41e.json').pipe(
    map((s) => this.chartMapper(s))
  );
  theme: 'dark' | 'light';
  screenWidth: number = window.innerWidth;
  roadmapColumns = [0];
  roadmap = [
    { title: 'Core', description: 'Form builder, Core utilities, Basic form fields', state: 'done', library: true },
    { title: 'Events', description: 'Refueling, Cost summary, Repairs, Insurance', state: 'done' }, 
    { title: 'Tires', description: 'Tire changes, Tire brands, Tire models', state: 'done' }, 
    { title: 'App dashboard', description: 'Demo tiles, Detailed statistics and insights', state: 'done' },
    { title: 'Menu', description: 'Expandable menu with a tree structure, Mobile layout', state: 'done', library: true }, 
    { title: 'Welcome page', description: 'Public page for non-logged users, Overview tab, Specification tab, Roadmap tab, About me tab', state: 'done' },
    { title: 'Jenkins', description: 'Continuous integration and delivery', state: 'done' },
    { title: 'Task system', description: 'Bug reporting, Development tracking, Feature requests', state: 'inProgress', library: true },
    { title: 'Enhanced statistics', description: 'Library chart component, Detailed cost dashboard charts', state: 'done', library: true },
    { title: 'Notifications', description: 'Customizable notifications, Email based on event date', state: 'planned', library: true },
    { title: 'Trips', description: "Splitting trip costs", state: 'planned' },
    { title: 'Core 1.0', description: 'Full version of form builder', state: 'planned', library: true },
    { title: 'Rating', description: 'Tire rating and reviews', state: 'underConsideration' },
    { title: 'Community', description: 'User forums', state: 'underConsideration' },
    { title: 'Offline mode', description: 'Ability to save documents without an internet connection', state: 'underConsideration' },
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
    { title: 'Jenkins', logo: 'https://www.svgrepo.com/show/373699/jenkins.svg', background: '#49728b'},
    { title: 'Nginx', logo: 'https://www.svgrepo.com/show/354115/nginx.svg', background: '#009639'},
  ]

  specs = [
    {title: 'OAUTH2', icon: 'fingerprint' },
    {title: 'TEMPORARY_ACCOUNT', icon: 'auto_delete'},
    {title: 'SMTP', icon: 'mail'},
    {title: 'VPS', icon: 'host'},
    {title: 'LIBRARIES', icon: 'category'},
    {title: 'PWA', icon: 'install_desktop'},
    {title: 'BETA', icon: 'experiment'},
    {title: 'JENKINS', icon: 'rocket_launch'},
  ]
 
  
  constructor(
    private http: HttpClient,
    public profile: ProfileService,
    public translate: TranslateService){
    
  }


  ngOnInit(): void {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark'
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.theme = event.matches ? "dark" : "light";
    });

    this.calculateRoadmapConfig();
    
  }

  ngAfterViewInit(): void {
    const canvas = document.getElementById("artCanvas");
    //@ts-ignore
    const ctx = canvas.getContext("2d");

    canvas['width'] = window.innerWidth;
    canvas['height'] = window.innerHeight;

    const w = this.graphic.nativeElement.clientWidth;
    const h = this.graphic.nativeElement.clientHeight;

    for(let i = 1; i < 10; i++)
      setTimeout(() => this.drawStarBlob(ctx, w * 2, h * 2 , Utils.Style.hexAdjustBrightness(Utils.Style.getCssVariable('--sys-primary'), i / 10)), 10);

  }

  getTileStateIcon(state: string): string{
    switch(state){
      case 'done': return 'check_circle';
      case 'planned': return 'cancel';
      case 'underConsideration': return 'help';
      default: return 'build_circle';
    }
  }

  calculateRoadmapConfig(): void {
    switch(true){
      case(this.screenWidth < 768): this.roadmapColumns = [0]; break;
      case( 1200 > this.screenWidth && this.screenWidth > 768): this.roadmapColumns = [0,1]; break;
      default: this.roadmapColumns = [0,1,2];
    }
  }

  getImagePath(name: string){
    let path = './../../../assets/img/' + name;
    if(this.theme === 'dark') path += '_dark';
    path += '.png';

    return path;

  }

  splitDescription(description: string): string[]{
    return this.translate.instant(description).split(',')
  }


  /**
   * Draws a full-canvas, star-like organic blob using quadratic Bézier curves.
   *
   * @param ctx - The CanvasRenderingContext2D to draw on.
   * @param width - Canvas width.
   * @param height - Canvas height.
   * @param color - Fill color (e.g. "#ffb4a4").
   * @param points - Number of star points (default: 12).
   */
  private drawStarBlob(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string,
  ): void {
    const centerX = _.random(0, width) / 2;
    const centerY = _.random(0, height) / 2;

    const points = _.random(4,8)

    const outerRadius = Math.min(width, height) * 0.2;
    const innerRadius = outerRadius * 1.6;

    const random = (() => {
      const seed = Math.random() * 100000;
      let s = seed;
      return () => {
        const x = Math.sin(s++) * 10000;
        return x - Math.floor(x);
      };
    })();

    const starPoints: [number, number][] = [];

    for (let i = 0; i < points * 2; i++) {
      const angle = (Math.PI * i) / points;
      const isOuter = i % 2 === 0;

      // Tighter control over random variation to prevent sharp spikes
      const variation = isOuter
        ? 0.95 + random() * 0.1  // outer radius stays within 95–105%
        : 0.85 + random() * 0.1; // inner radius stays within 85–95%

      const radius = (isOuter ? outerRadius : innerRadius) * variation;

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      starPoints.push([x, y]);
    }

    ctx.beginPath();
    ctx.moveTo(starPoints[0][0], starPoints[0][1]);

    for (let i = 0; i < starPoints.length; i++) {
      const current = starPoints[i];
      const next = starPoints[(i + 1) % starPoints.length];

      // Optional: soften sharp edges by slightly shifting control point inward
      const xc = (current[0] + next[0]) / 2;
      const yc = (current[1] + next[1]) / 2;

      ctx.quadraticCurveTo(current[0], current[1], xc, yc);
    }

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  private chartMapper = (wakaTimeData: wakaTimeData): ChartConfiguration=> {
    return {
      type: 'doughnut',
      options:{
        responsive: true,
          plugins: {
          legend: {display: false},
        },
      },
      
      data: {
        labels: wakaTimeData.data.map(e => e.name),
        datasets: [
          {
            label: 'Percent',
            data: wakaTimeData.data.map(e => e.percent),
            
            backgroundColor:  wakaTimeData.data.map(e => e.color),
            borderColor: 'transparent'
          },
        ]
      }
    }
  }

}
