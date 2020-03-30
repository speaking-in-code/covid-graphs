import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from "@angular/router";

import { PrefsObserver } from './prefs-observer.service';

describe('PrefsObserver', () => {
  let service: PrefsObserver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            queryParamMap: {
              subscribe(obs) {
              }
            }
          }
        }
      ]
    });
    service = TestBed.inject(PrefsObserver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
