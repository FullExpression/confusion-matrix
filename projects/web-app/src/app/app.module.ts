import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfusionMatrixModule } from 'projects/confusion-matrix/src/public-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorIntensityPicker, MatrixConfiguration } from './components';

@NgModule({
    declarations: [
        AppComponent,
        ColorIntensityPicker,
        MatrixConfiguration
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ConfusionMatrixModule,
        BrowserAnimationsModule,
        MaterialModule,
        ColorPickerModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
