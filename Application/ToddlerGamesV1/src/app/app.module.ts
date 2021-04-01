import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgApexchartsModule } from "ng-apexcharts";
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DraggableDirective } from './game1/draggable.directive';
import { DroppableDirective } from './game1/droppable.directive';
import { Game1Component } from './game1/game1.component';
import { SVGService } from './game1/svg.service';
import { Game2Component } from './game2/game2.component';
import { Game3Component } from './game3/game3.component';
import { StatsComponent } from './stats/stats.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    Game1Component,
    Game2Component,
    Game3Component,
    HomepageComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    DraggableDirective,
    StatsComponent,
    DroppableDirective

  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    A11yModule,
    MatRadioModule,
    MDBBootstrapModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    DragDropModule,
    NgApexchartsModule
  ],
  providers: [SVGService],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
