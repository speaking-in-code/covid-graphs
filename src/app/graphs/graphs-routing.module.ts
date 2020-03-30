import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GraphsComponent} from "./graphs.component";
import { InfectionsComponent } from "./infections/infections.component";

const routes: Routes = [
  { path: 'graphs', component: InfectionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphsRoutingModule { }
