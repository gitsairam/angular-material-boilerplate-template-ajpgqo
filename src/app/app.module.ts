import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { StyleManagerService } from './style-manager.service';
import { ThemeService } from './theme.service';
import { HttpClientModule } from '@angular/common/http';
import { AmbientLightSensorService } from './ambient-light-sensor.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
  ],
  providers: [
    StyleManagerService,
    ThemeService,
    AmbientLightSensorService,
    {
      provide: Window,
      useValue: window,
    },
  ],
  declarations: [AppComponent, HelloComponent, HeaderComponent, MenuComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
