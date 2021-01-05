import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ConfusionMatrixSizes } from 'projects/confusion-matrix/src/lib/components/confusion-matrix.models';
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

    matrixTitle = 'Matrix Title';

    size = ConfusionMatrixSizes.Medium;

    get sizes(): Array<string> {
        return Object.keys(ConfusionMatrixSizes);
    }

    changeTitle(event: any) {

        // Waits for input to change is value 
        setTimeout(() => {
            this.matrixTitle = event.target.value;
        });
    }

    selectionChange(event: MatSelectChange) {
        this.size = (<any>ConfusionMatrixSizes)[event.value];
    }

}
