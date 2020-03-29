import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from '@ng-select/ng-select';
import { PlotlyViaWindowModule } from 'angular-plotly.js';
import { GraphsRoutingModule } from './graphs-routing.module';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { GraphsComponent } from "./graphs.component";
import { SelectorComponent } from './selector/selector.component';

@NgModule({
  declarations: [
    GraphsComponent,
    SelectorComponent
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
    MatCardModule,
    MatChipsModule,
  ]
})
export class GraphsModule {
}
