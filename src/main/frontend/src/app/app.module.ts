import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { EventComponent } from './components/event/event.component';
import { TableComponent } from './tools/table/table.component';
import { PortalModule} from '@angular/cdk/portal';


@NgModule({
  declarations: [AppComponent, DashboardComponent, EventComponent, TableComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatSidenavModule,
    MatSidenavModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatRippleModule,
    MatCardModule,
    TranslateModule.forRoot(),
    MatTableModule,
    PortalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
