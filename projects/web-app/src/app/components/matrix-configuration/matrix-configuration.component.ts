import { ApplicationRef, Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ConfusionMatrix, ConfusionMatrixSizes } from 'projects/confusion-matrix/src/lib/components/confusion-matrix.models';

@Component({
    selector: 'matrix-configuration',
    templateUrl: 'matrix-configuration.component.html',
    styleUrls: ['./matrix-configuration.component.scss']
})

export class MatrixConfiguration {

    confusionMatrix = new ConfusionMatrix({
        labels: ["Happiness", "Sadness", "Fear", "Disgust", "Anger", "Contempt", "Surprise"],
        matrix:
            [[50, 2, 3, 4, 5, 6, 7],
            [8, 50, 10, 11, 12, 13, 14],
            [15, 16, 50, 18, 19, 20, 21],
            [22, 23, 24, 50, 26, 27, 28],
            [29, 30, 31, 32, 50, 34, 35],
            [36, 37, 38, 39, 40, 50, 42],
            [43, 44, 45, 46, 47, 48, 50]]
    });

    matrixTitle = 'Matrix Title';

    size = ConfusionMatrixSizes.Large;

    colors = ['transparent', '#FADBD8', '#F5B7B1', '#F1948A', '#EC7063', '#E74C3C'];

    get sizes(): Array<string> {
        return Object.keys(ConfusionMatrixSizes);
    }

    constructor(private _applicationRef: ApplicationRef) { }

    changeTitle(event: any) {

        // Waits for input to change is value 
        setTimeout(() => {
            this.matrixTitle = event.target.value;
        });
    }

    changeValues(event: any) {

        // Waits for input to change is value 
        setTimeout(() => {
            this.confusionMatrix.matrix = JSON.parse(event.target.value);
        });
    }
    changeLabels(event: any) {

        // Waits for input to change is value 
        setTimeout(() => {
            this.confusionMatrix.labels = JSON.parse(event.target.value);
        });
    }

    changeConfusionMatrix(confusionMatrix: ConfusionMatrix) {
        this.confusionMatrix = confusionMatrix.clone();
    }

    selectionChange(event: MatSelectChange) {
        this.size = (<any>ConfusionMatrixSizes)[event.value];
    }
}