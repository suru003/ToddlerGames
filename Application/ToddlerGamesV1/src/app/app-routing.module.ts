import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { Game1Component } from './game1/game1.component';
import { Game2Component } from './game2/game2.component';
import { Game3Component } from './game3/game3.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path:'app-homepage', component:HomepageComponent},
  {path:'app-profile', component:ProfileComponent},
  {path:'app-game1', component:Game1Component},
  {path:'app-game2', component:Game2Component},
  {path:'app-game3', component:Game3Component},
  {path:'', component:HomepageComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
