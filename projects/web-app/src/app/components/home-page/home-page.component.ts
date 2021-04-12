import { Component } from "@angular/core";
import { version } from '../../../../../confusion-matrix/package.json';
@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
    appVersion = version;
}