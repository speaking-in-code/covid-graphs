import { Component } from '@angular/core';

import DailyStats from '../assets/daily.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'covid-graphs';

  stats = DailyStats;
}
