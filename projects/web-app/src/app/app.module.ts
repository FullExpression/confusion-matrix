import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfusionMatrixModule } from 'projects/confusion-matrix/src/public-api';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ConfusionMatrixModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
