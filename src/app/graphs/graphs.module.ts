import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from '@ng-select/ng-select';
import { PlotlyViaWindowModule } from 'angular-plotly.js';
import { GraphsRoutingModule } from './graphs-routing.module';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { SelectorComponent } from './selector/selector.component';
import { InfectionsComponent } from './infections/infections.component';

@NgModule({
  declarations: [
    SelectorComponent,
    InfectionsComponent
  ],
  exports: [
    SelectorComponent
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
