import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from '@ng-select/ng-select';
import { PlotlyViaWindowModule } from 'angular-plotly.js';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { SelectorComponent } from './selector.component';
import { InfectionsComponent } from './infections.component';

@NgModule({
  declarations: [
    SelectorComponent,
    InfectionsComponent
  ],
  exports: [
    SelectorComponent,
    InfectionsComponent
  ],
  imports: [
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
