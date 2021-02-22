import { Component } from '@angular/core';
import { version } from '../../../confusion-matrix/package.json';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    appVersion = version;
}
