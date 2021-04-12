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
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { EditorComponent } from './components/editor/editor.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ButtonComponent } from './components/html-basics/buttons/button/button.component';
import { HomePageLineComponent } from './components/home-page/line/line-home-page.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
@NgModule({
    declarations: [
        AppComponent,
        MatrixConfiguration,
        TopBarComponent,
        EditorComponent,
        HomePageComponent,
        ButtonComponent,
        HomePageLineComponent,
        DocumentationComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ConfusionMatrixModule,
        BrowserAnimationsModule,
        MaterialModule,
        ColorPickerModule,
        MatSliderModule,
        FormsModule,
        RouterModule.forRoot(routes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
