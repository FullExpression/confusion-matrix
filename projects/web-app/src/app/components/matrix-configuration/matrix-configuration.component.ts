import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ConfusionMatrix } from '@fullexpression/confusion-matrix-stats';


@Component({
    selector: 'matrix-configuration',
    templateUrl: 'matrix-configuration.component.html',
    styleUrls: ['./matrix-configuration.component.scss']
})

export class MatrixConfiguration {

    confusionMatrix = new ConfusionMatrix({
        labels: ["Happiness", "Sadness", "Fear", "Disgust", "Anger", "Contempt", "Surprise"],
        matrix:
            [[50, 20, 1, 0, 1, 0, 7],
            [2, 50, 40, 20, 12, 0, 0],
            [15, 16, 50, 30, 0, 0, 0],
            [23, 0, 20, 50, 20, 30, 0],
            [0, 10, 20, 30, 50, 16, 0],
            [0, 0, 0, 0, 17, 50, 40],
            [0, 6, 15, 7, 5, 1, 50]]
    });

    matrixTitle = 'Full Expression';

    zoom = 1;

    colors = ['transparent', '#FADBD8', '#F5B7B1', '#F1948A', '#EC7063', '#E74C3C'];

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

    matrixChanged($event: any) {
        console.log($event);
    }

    private refreshMatrixValues() {
        this.confusionMatrix = this.confusionMatrix.clone();
    }
}