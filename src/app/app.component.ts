import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { ChosenStates, PrefsObserver } from "./prefs-observer.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private static kMaxLabelsDisplayed = 6;
  private subscription: Subscription;
  states = '';

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
