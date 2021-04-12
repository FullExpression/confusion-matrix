import { Routes } from "@angular/router";
import { DocumentationComponent } from "./components/documentation/documentation.component";
import { EditorComponent } from "./components/editor/editor.component";
import { HomePageComponent } from "./components/home-page/home-page.component";

export const routes: Routes = [
    { path: 'editor', component: EditorComponent, data: { animation: 'editor' } },
    { path: 'documentation', component: DocumentationComponent, data: { animation: 'documentation' } },
    { path: '', component: HomePageComponent, data: { animation: 'home' } },
    { path: 'home', component: HomePageComponent, data: { animation: 'home' } },
    { path: '**', redirectTo: '' }
];