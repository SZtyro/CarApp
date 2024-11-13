import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PortalModule } from '@angular/cdk/portal';
import { EventFormComponent } from './components/forms/event-form/event-form.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FuelSummary } from './components/fuel-summary/fuel-summary.component';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { CarFormComponent } from './components/forms/car-form/car-form.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CarTimelineComponent } from './components/car-timeline/car-timeline.component';
import {
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoreModule } from '@sztyro/core'
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export let AppInjector: Injector;

class AppTranslateLoader {
  getTranslation(lang: string) {
    return;
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'api/translations/', '');
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EventFormComponent,
    FuelSummary,
    CarFormComponent, 
    CarTimelineComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatRippleModule,
    MatCardModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'pl_PL',
    }), 
    MatTableModule,
    PortalModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSnackBarModule,
  ],
  providers: [
    // { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },

    // provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {
  constructor(private injector: Injector) {
  
  }
}