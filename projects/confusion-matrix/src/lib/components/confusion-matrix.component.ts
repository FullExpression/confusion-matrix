
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ConfusionMatrix, ConfusionMatrixSizes } from './confusion-matrix.models';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'confusion-matrix',
    templateUrl: './confusion-matrix.component.html',
    styleUrls: ['./confusion-matrix.component.scss']
})
export class ConfusionMatrixComponent {

    /**
     * Sets the confusion matrix title.
     * If undefined, the title reserved space will be hidden.
     */
    @Input()
    title: string | undefined;

    /**
     * Represents the confusion matrix size.
     */
    @Input()
    size = ConfusionMatrixSizes.Large;

    /**
     * Sets the confusion matrix color level (a.k.a color intensity).
     * Should be order asc from less intense (close to 0) to max intense (close to max value).
     */
    @Input()
    set levelsColor(levelsColor: Array<string>) {
        this._levelsColor = this.deepCopy(levelsColor);
        this.updateIntensityValues(this._confusionMatrix);
    }

    /**
     * Sets the confusion matrix labels and values.
     */
    @Input()
    set confusionMatrix(value: ConfusionMatrix) {
        this._confusionMatrix = this.deepCopy(value);
        this.updateIntensityValues(value);
        this.reverseMatrix();

    }

    /**
     * https://angular.io/api/common/DecimalPipe
     */
    @Input()
    roundRules = '1.0-2';

    @ViewChild('lines') lines: ElementRef | undefined;

    getSquareSize(): number {
        const _lines = this.lines?.nativeElement;
        if (_lines) {
            const line = _lines.getElementsByClassName('line')[0];
            if (line) {
                return line.clientWidth;
            }
        }

        return 0;
    }

    get intensityHeight(): number {
        return this.getSquareSize() * this._confusionMatrix.matrix.length;
    }

    _levelsColor = new Array<string>();

    _confusionMatrix = new ConfusionMatrix();

    levelsStep = 0;


    constructor(private decimalPipe: DecimalPipe) { }

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
        const style = {
            'background': `linear-gradient(${this._levelsColor})`
        };
        return style;
    }

    getIntensityNumber(index: number): string {
        if (index === 0) {
            return '0';
        } else {
            if (this._levelsColor.length > this.levelsStep * this._levelsColor.length) {
                return this.decimalPipe.transform((index + 1) * this.levelsStep, this.roundRules) ?? '0';
            } else {
                return String(Math.round((index + 1) * this.levelsStep));
            }

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
        this.levelsStep = max / this._levelsColor.length;
        if (this.levelsStep === Infinity) {
            this.levelsStep = 0;
        }
    }

    private reverseMatrix(): void {
        let matrix = this._confusionMatrix.matrix;
        this._confusionMatrix.matrix = matrix[0].map((col, i) => matrix.map(row => row[i]));
    }

    private deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }

}
