import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from "@ng-select/ng-select";
import { PlotlyViaWindowModule } from "angular-plotly.js";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChangeInGrowthComponent } from "./change-in-growth/change-in-growth.component";
import { DailyDeathsComponent } from "./daily-deaths/daily-deaths.component";
import { DailyInfectionsComponent } from "./daily-infections/daily-infections.component";
import { DeathsComponent } from "./deaths/deaths.component";
import { GrowthRateComponent } from "./growth-rate/growth-rate.component";
import { InfectionsComponent } from "./infections/infections.component";
import { SelectorComponent } from "./selector/selector.component";
import { InfectionRateComponent } from './infection-rate/infection-rate.component';
import { TestsPerPositiveComponent } from "./tests-per-positive/tests-per-positive.component";

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
    MatSidenavModule,
    MatRadioModule,
  ],
  declarations: [
    AppComponent,
    ChangeInGrowthComponent,
    DailyDeathsComponent,
    DailyInfectionsComponent,
    DeathsComponent,
    GrowthRateComponent,
    InfectionsComponent,
    SelectorComponent,
    InfectionRateComponent,
    TestsPerPositiveComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
