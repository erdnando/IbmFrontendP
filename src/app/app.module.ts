import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AppRoutingModule,routingComponents} from './app-routing.module';
import{HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import{FlexLayoutModule } from '@angular/flex-layout';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SublevelMenuComponent } from './Plantillas/sidenav/sidenav/sublevel-menu.component';
import { BodyComponent } from './Plantillas/sidenav/body/body.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    SublevelMenuComponent, 
    BodyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FullCalendarModule,
    SweetAlert2Module,
    NgApexchartsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
