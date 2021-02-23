import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {A11yModule} from '@angular/cdk/a11y';
import { Game1Component } from './game1/game1.component';
import { Game2Component } from './game2/game2.component';
import { Game3Component } from './game3/game3.component';
@NgModule({
  declarations: [
    AppComponent,
    Game1Component,
    Game2Component,
    Game3Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    A11yModule,
    MDBBootstrapModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
]
})
export class AppModule { }
