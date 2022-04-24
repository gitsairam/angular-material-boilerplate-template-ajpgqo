import { ReplaySubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  SENSOR_NAME,
  SENSOR_POLICY_NAME,
  ACCESS_DENIED,
  ERROR_TYPES,
  ERROR_MESSAGES,
} from './common_constants';

@Injectable()
export class AmbientLightSensorService {
  private illuminance: ReplaySubject<number> = new ReplaySubject<number>(1);
  illuminance$: Observable<number> = this.illuminance.asObservable();

  constructor(private window: Window) {
    try {
      if (SENSOR_NAME in window) {
        this.startReading();
      } else {
        this.illuminance.error(ERROR_MESSAGES.UNSUPPORTED_FEATURE);
      }
    } catch (error) {
      // Handle construction errors.
      if (error.name === ERROR_TYPES.SECURITY) {
        this.illuminance.error(ERROR_MESSAGES.BLOCKED_BY_FEATURE_POLICY);
      } else if (error.name === ERROR_TYPES.REFERENCE) {
        this.illuminance.error(ERROR_MESSAGES.NOT_SUPPORTED_BY_USER_AGENT);
      } else {
        this.illuminance.error(`${error.name}: ${error.message}`);
      }
    }
  }

  private startReading() {
    const sensor = new AmbientLightSensor();
    sensor.onreading = () => this.illuminance.next(sensor.illuminance);
    sensor.onerror = async (event) => {
      // Handle runtime errors.
      if (event.error.name === ERROR_TYPES.NOT_ALLOWED) {
        // Branch to code for requesting permission.
        const result = await navigator.permissions.query({
          name: SENSOR_POLICY_NAME,
        });
        if (result.state === ACCESS_DENIED) {
          this.illuminance.error(ERROR_MESSAGES.PREMISSION_DENIED);
          return;
        }
        this.startReading();
      } else if (event.error.name === ERROR_TYPES.NOT_READABLE) {
        this.illuminance.error(ERROR_MESSAGES.CANNOT_CONNECT);
      }
    };
    sensor.start();
  }
}
