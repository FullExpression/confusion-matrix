import { Routes } from "@angular/router";
import { DocumentationComponent } from "./components/documentation/documentation.component";
import { EditorComponent } from "./components/editor/editor.component";
import { HomePageComponent } from "./components/home-page/home-page.component";

export const routes: Routes = [
    { path: 'editor', component: EditorComponent },
    { path: 'documentation', component: DocumentationComponent },
    { path: '', component: HomePageComponent },
    { path: '**', redirectTo: '' }
];