import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTab } from "@angular/material/tabs";
import { Subscription } from "rxjs";
import { ChosenStates, ChosenTab, PrefsObserver } from "./prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private static kMaxLabelsDisplayed = 6;
  private subscription: Subscription;
  states = '';

  navLinks = [
    { path: 'infections', label: 'Infections'},
    { path: 'test-rate', label: 'Test Rates'},
    { path: 'infection-rate', label: 'Infections Per Million'},
    { path: 'growth', label: 'Growth Rates' },
  ];
  constructor(private prefsObserver: PrefsObserver) {
  }

  ngOnInit() {
    this.subscription = this.prefsObserver.chosenStates().subscribe(
      this.onChosenStatesChange.bind(this));
  }

  private onChosenStatesChange(states: ChosenStates) {
    let labels = [];
    for (let i = 0; i < Math.min(AppComponent.kMaxLabelsDisplayed, states.states.length); ++i) {
      labels.push(states.states[i].metadata.name);
    }
    if (labels.length < states.states.length) {
      labels.push('...');
    }
    this.states = labels.join(', ');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
