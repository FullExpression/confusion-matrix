import { Component } from '@angular/core';
import { ConfusionMatrix } from 'projects/confusion-matrix/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'web-app';

    confusionMatrix: ConfusionMatrix = {
        labels: ["AAA", "BBB", "CCC", "DDD", "EEEE"],
        matrix:
            [[50, 2, 3, 4, 5],
            [6, 50, 8, 9, 10],
            [11, 12, 50, 14, 15],
            [16, 17, 18, 50, 20],
            [21, 22, 23, 24, 50]]
    };
}
