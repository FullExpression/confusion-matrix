import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ConfusionMatrix } from '@fullexpression/confusion-matrix-stats';
import { ConfusionMatrixSizes } from 'projects/confusion-matrix/src/lib/components/confusion-matrix.models';


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

    matrixTitle = 'Awesome title';

    size = ConfusionMatrixSizes.Large;

    colors = ['transparent', '#FADBD8', '#F5B7B1', '#F1948A', '#EC7063', '#E74C3C'];

    get sizes(): Array<string> {
        return Object.keys(ConfusionMatrixSizes);
    }

    @ViewChild("labelElement") labelElement: ElementRef | undefined;

    @ViewChild("valuesElement") valuesElement: ElementRef | undefined;

    @ViewChild("titleElement") titleElement: ElementRef | undefined;

    changeTitle(event: any) {
        this.matrixTitle = event.target.value;
    }

    changeValues() {
        this.confusionMatrix.matrix = JSON.parse(this.valuesElement?.nativeElement.value);
        this.refreshMatrixValues();
    }

    changeLabels() {
        this.confusionMatrix.labels = JSON.parse(this.labelElement?.nativeElement.value);
        this.refreshMatrixValues();
    }

    changeConfusionMatrix(confusionMatrix: ConfusionMatrix) {
        this.confusionMatrix = confusionMatrix.clone();
    }

    selectionChange(event: MatSelectChange) {
        this.size = (<any>ConfusionMatrixSizes)[event.value];
    }

    matrixChanged($event: any) {
        console.log($event);
    }

    private refreshMatrixValues() {
        this.confusionMatrix = this.confusionMatrix.clone();
    }
}