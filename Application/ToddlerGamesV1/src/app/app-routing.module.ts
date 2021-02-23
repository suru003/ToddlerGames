import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Game1Component } from './game1/game1.component';
import { Game2Component } from './game2/game2.component';
import { Game3Component } from './game3/game3.component';

const routes: Routes = [
  {path:'app-game1', component:Game1Component},
  {path:'app-game2', component:Game2Component},
  {path:'app-game3', component:Game3Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
