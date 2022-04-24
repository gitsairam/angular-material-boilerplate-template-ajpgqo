import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AmbientLightSensorService } from '../ambient-light-sensor.service';
import { DARK_THEME, LIGHT_THEME } from '../common_constants';
import { Option } from '../option.model';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  options$: Observable<Array<Option>> = this.themeService.getThemeOptions();
  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly themeService: ThemeService,
    private readonly alsService: AmbientLightSensorService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.themeService.setTheme(DARK_THEME);
    this.alsService.illuminance$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (illuminance) => {
        illuminance <= 10
          ? this.themeService.setTheme(DARK_THEME)
          : this.themeService.setTheme(LIGHT_THEME);
      },
      (error) => this.showMessage(error)
    );
  }

  themeChangeHandler(themeToSet) {
    this.themeService.setTheme(themeToSet);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private showMessage(messageToShow) {
    this.snackBar.open(messageToShow, 'OK', {
      duration: 4000,
    });
  }
}
