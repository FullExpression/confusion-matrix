
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ConfusionMatrix, ConfusionMatrixSizes } from './confusion-matrix.models';
import { DecimalPipe } from '@angular/common';
// import * as html2canvas from "html2canvas";

/**
 * Component which helps to visualize a confusion matrix.
 * As a set o function allowing some level of visual configuration.
 */
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
     * Allows to define the numbers display format.
     * If follows the angular decimal pipes rules: 
     * https://angular.io/api/common/DecimalPipe
     */
    @Input()
    roundRules = '1.0-2';

    /**
     * Confusion matrix line dom element reference.
     */
    @ViewChild('lines') lines: ElementRef | undefined;

    /**
     * Confusion matrix wrapper dom element reference.
     */
    @ViewChild('confusionMatrix') confusionMatrixElement: ElementRef | undefined;

    /**
     * Gets the intensity bar height.
     * @return Gets the intensity height in pixels.
     */
    get intensityHeight(): number {
        return this.getSquareSize() * this._confusionMatrix.matrix.length;
    }

    /**
     * Confusion matrix color level (a.k.a color intensity).
     */
    _levelsColor = new Array<string>();

    /**
     * Confusion matrix labels and values
     */
    _confusionMatrix = new ConfusionMatrix();

    /**
     * Represents how many different color intensities exists.
     */
    private levelsStep = 0;

    /**
     * Constructs the confusion matrix.
     * @decimalPipe Decimal angular service injected using dependency injection.
     */
    constructor(private decimalPipe: DecimalPipe) { }

    /**
     * Given a value, returns the color intensity associated with.
     * @return Color intensity in hexadecimal.
     */
    getColor(value: number): string {
        const levelsNumber = this._levelsColor.length;
        for (let i = 1; i <= levelsNumber; i++) {
            if (this.levelsStep * i >= (value - (this.levelsStep / 2))) {
                return this._levelsColor[i - 1];
            }
        }
        return this._levelsColor[0];
    }

    /**
     * Gets the background color for the intensity bar.
     * @returns The background color style.
     */
    getGradientBackground(): { [key: string]: string } {
        const style = {
            'background': `linear-gradient(${this._levelsColor})`
        };
        return style;
    }

    /**
     * Gets the insensitive number for a given position of the intensity bar. 
     * @param index 
     * @returns 
     */
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

    /**
     * Downloads a image of the confusion matrix.
     * IT IS NOT YET FULLY IMPLEMENTED. BETA ONLY!
     */
    download() {
        // html2canvas(this.confusionMatrixElement?.nativeElement).then((canvas) => {
        //     const link = document.createElement('a');
        //     link.download = 'confusion-matrix.png';
        //     link.href = canvas.toDataURL()
        //     link.click();
        //     link.remove();
        // });
    }

    /**
     * Gets the square size for each confusion matrix value.
     * @returns The square size.
     */
    private getSquareSize(): number {
        const _lines = this.lines?.nativeElement;
        if (_lines) {
            const line = _lines.getElementsByClassName('line')[0];
            if (line) {
                return line.clientWidth;
            }
        }

        return 0;
    }

    /**
     * Updates the confusion matrix intensity bar.
     * @param confusionMatrix The new confusion matrix.
     */
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

    /**
     * Changes the lines by the columns.
     */
    private reverseMatrix(): void {
        let matrix = this._confusionMatrix.matrix;
        this._confusionMatrix.matrix = matrix[0].map((col, i) => matrix.map(row => row[i]));
    }

    /**
     * Deep copies a given object.
     * @param object The object to be deep copied.
     * @returns The deep copied object.
     */
    private deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }

}
