import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'top-bar',
    styleUrls: ['./top-bar.component.scss'],
    templateUrl: './top-bar.component.html'
})
export class TopBarComponent {

    constructor(private router: Router) { }

    isHomeActive(): boolean {
        return this.router.isActive('', true);
    }
}