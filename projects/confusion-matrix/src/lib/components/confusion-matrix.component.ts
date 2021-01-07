
import { Component, Input } from '@angular/core';
import { ConfusionMatrix } from '../interface/confusion-matrix.interface';
import { ConfusionMatrixSizes } from './confusion-matrix.models';

@Component({
    selector: 'confusion-matrix',
    templateUrl: './confusion-matrix.component.html',
    styleUrls: ['./confusion-matrix.component.scss']
})
export class ConfusionMatrixComponent {

    @Input()
    title = 'This is an title example';

    @Input()
    size = ConfusionMatrixSizes.Large;

    @Input()
    set levelsColor(levelsColor: Array<string>) {
        this._levelsColor = levelsColor;
    }

    @Input()
    set confusionMatrix(value: ConfusionMatrix) {
        this.updateIntensityValues(value);
        this._confusionMatrix = value;
        this.reverseMatrix();

    }

    _levelsColor = ['transparent', '#FADBD8', '#F5B7B1', '#F1948A', '#EC7063', '#E74C3C'];

    _confusionMatrix: ConfusionMatrix = {
        labels: [],
        matrix: [[]],
    };

    levelsStep = 0;

    getColor(value: number): string {
        const levelsNumber = this._levelsColor.length;
        for (let i = 1; i <= levelsNumber; i++) {
            if (this.levelsStep * i >= (value - (this.levelsStep / 2))) {
                return this._levelsColor[i - 1];
            }
        }
        return this._levelsColor[0];
    }

    getGradientBackground(): { [key: string]: string } {
        const colors = [...this._levelsColor].reverse();
        const style = {
            'background': `linear-gradient(${this._levelsColor})`
        };
        return style;
    }

    getIntensityNumber(index: number): number {
        return Math.round((index + 1) * this.levelsStep);
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
        this.levelsStep = max / this._levelsColor.length;
    }

    private reverseMatrix(): void {
        let matrix = this._confusionMatrix.matrix;
        this._confusionMatrix.matrix = matrix[0].map((col, i) => matrix.map(row => row[i]));
    }

}
