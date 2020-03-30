import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from "@ng-select/ng-select";
import { PlotlyViaWindowModule } from "angular-plotly.js";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GrowthRateComponent } from "./growth-rate/growth-rate.component";
import { InfectionsComponent } from "./infections/infections.component";
import { SelectorComponent } from "./selector/selector.component";

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule,
    NgSelectModule,
    PlotlyViaWindowModule,
  ],
  declarations: [
    AppComponent,
    GrowthRateComponent,
    InfectionsComponent,
    SelectorComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
