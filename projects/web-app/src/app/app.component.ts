import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('routeAnimations', [
            transition(
                '* => *',
                [
                    style({ opacity: 0, marginTop: '-20px', transform: 'scale(0.95)' }),
                    animate('0.2s',
                        style({ opacity: 1, marginTop: '0', transform: 'scale(1)' }))
                ]
            )
        ])
    ]
})
export class AppComponent {

    constructor(private router: Router) { }

    isHomeActive(): boolean {
        return this.router.isActive('', true);
    }

    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    }

}
