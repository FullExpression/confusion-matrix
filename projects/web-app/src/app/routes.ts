import { Routes } from "@angular/router";
import { EditorComponent } from "./components/editor/editor.component";
import { HomePageComponent } from "./components/home-page/home-page.component";

export const routes: Routes = [
    { path: 'editor', component: EditorComponent },
    { path: '', component: HomePageComponent },
    { path: '**', redirectTo: '' }
];