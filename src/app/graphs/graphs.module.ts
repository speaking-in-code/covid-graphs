import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from '@ng-select/ng-select';
import { PlotlyViaWindowModule } from 'angular-plotly.js';
import { GraphsRoutingModule } from './graphs-routing.module';
import { GraphsComponent } from "./graphs.component";


@NgModule({
  declarations: [
    GraphsComponent
  ],
  exports: [
    GraphsComponent
  ],
  imports: [
    GraphsRoutingModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    PlotlyViaWindowModule,
  ]
})
export class GraphsModule {}
