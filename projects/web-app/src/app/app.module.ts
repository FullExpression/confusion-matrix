import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfusionMatrixModule } from 'projects/confusion-matrix/src/public-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatrixConfiguration } from './components';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
@NgModule({
    declarations: [
        AppComponent,
        MatrixConfiguration,
        TopBarComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ConfusionMatrixModule,
        BrowserAnimationsModule,
        MaterialModule,
        ColorPickerModule,
        MatSliderModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
