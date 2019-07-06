
import { Component, Input } from '@angular/core';
import { ConfusionMatrix } from '../interface/confusion-matrix.interface';

@Component({
    selector: 'confusion-matrix',
    templateUrl: './confusion-matrix.component.html',
    styleUrls: ['./confusion-matrix.component.scss']
})
export class ConfusionMatrixComponent {

    _confusionMatrix: ConfusionMatrix;
    private level1: number = 0;

    @Input()
    set confusionMatrix(value: ConfusionMatrix) {
        this.updateIntensityValues(value);
        this._confusionMatrix = value;
        this.reverseMatrix();

    }

    getIntencityClass(value: number): string {
        if (value < 1) {
            return "level-0"
        } else if (value < (this.level1)) {
            return "level-1";
        } else if (value < (this.level1 * 2)) {
            return "level-2";
        } else if (value < (this.level1 * 3)) {
            return "level-3";
        } else if (value < (this.level1 * 4)) {
            return "level-4";
        } else {
            return "level-5";
        }
    }



    private updateIntensityValues(confusionMatrix: ConfusionMatrix): void {
        let matrix = confusionMatrix.matrix;
        let max = matrix[0][0];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (max < matrix[i][j]) {
                    max = matrix[i][j];
                }
            }
        }
        this.level1 = max / 5;
    }

    private reverseMatrix(): void {
        let matrix = this._confusionMatrix.matrix;
        this._confusionMatrix.matrix = matrix[0].map((col, i) => matrix.map(row => row[i]));
    }

}
