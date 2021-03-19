
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ConfusionMatrix } from '@fullexpression/confusion-matrix-stats';
import { ConfusionMatrixSizes } from './confusion-matrix.models';
import { DecimalPipe } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ConfigurationsOption } from './configurations/configurations.component.model';
// import * as html2canvas from "html2canvas";

/**
 * Component which helps to visualize a confusion matrix.
 * As a set o function allowing some level of visual configuration.
 */
@Component({
    selector: 'confusion-matrix',
    templateUrl: './confusion-matrix.component.html',
    styleUrls: ['./confusion-matrix.component.scss'],
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({
                            opacity: 0, marginTop: '-20px'
                        }),
                        animate('0.3s ease',
                            style({ opacity: 1, marginTop: 0 }))
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({ opacity: 1, marginTop: 0 }),
                        animate('0.3s ease',
                            style({ opacity: 0, marginTop: '-20px' }))
                    ]
                )
            ]
        ),
        trigger(
            'outAnimation',
            [
                transition(
                    ':leave',
                    [
                        style({ opacity: 1 }),
                        animate('0.15s ease',
                            style({ opacity: 0 }))
                    ]
                )
            ]
        )
    ]
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

    @Output()
    sizeChange = new EventEmitter<ConfusionMatrixSizes>();

    /**
     * Sets the confusion matrix color level (a.k.a color intensity).
     * Should be order asc from less intense (close to 0) to max intense (close to max value).
     */
    @Input()
    set levelsColor(levelsColor: Array<string>) {
        this._levelsColor = this.deepCopy(levelsColor);
        this.updateIntensityValues(this._confusionMatrix);
    }

    @Output()
    levelsColorChange = new EventEmitter<Array<string>>()

    /**
     * Sets the confusion matrix labels and values.
     */
    @Input()
    set confusionMatrix(value: ConfusionMatrix) {
        this._confusionMatrix = value.clone();
        this._confusionMatrixTransposed = this._confusionMatrix.clone();
        this._confusionMatrixTransposed.transpose();
        this.updateIntensityValues(value);

    }

    @Output()
    confusionMatrixChange = new EventEmitter<ConfusionMatrix>()

    /**
     * Allows to define the numbers display format.
     * If follows the angular decimal pipes rules: 
     * https://angular.io/api/common/DecimalPipe
     */
    @Input()
    roundRules = '1.0-2';

    /**
     * Confusion matrix row dom element reference.
     */
    @ViewChild('rows') rows: ElementRef | undefined;

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

    showOption = false;

    showConfigurationPanel = false;

    editMode = false;

    /**
     * Represents how many different color intensities exists.
     */
    private levelsStep = 0;

    _confusionMatrixTransposed = new ConfusionMatrix();

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

    getTranspose(): ConfusionMatrix {
        const clone = this._confusionMatrix.clone();
        clone.transpose();
        return clone;
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

    optionChanged(option: ConfigurationsOption) {

        switch (option) {
            case ConfigurationsOption.Edit:
                this.editMode = true;
                break;
            case ConfigurationsOption.ZoomIn:
                this.zoomIn();
                break;
            case ConfigurationsOption.ZoomOut:
                this.zoomOut();
                break;
            default:
                this.editMode = false;
        }
    }
    zoomIn() {
        switch (this.size) {
            case ConfusionMatrixSizes.Small:
                this.size = ConfusionMatrixSizes.Medium;
                return this.sizeChange.emit(this.size);
            case ConfusionMatrixSizes.Medium:
                this.size = ConfusionMatrixSizes.Large;
                return this.sizeChange.emit(this.size);
            case ConfusionMatrixSizes.Large:
                this.size = ConfusionMatrixSizes.ExtraLarge;
                return this.sizeChange.emit(this.size);
        }
    }

    zoomOut() {
        switch (this.size) {
            case ConfusionMatrixSizes.ExtraLarge:
                this.size = ConfusionMatrixSizes.Large;
                return this.sizeChange.emit(this.size);
            case ConfusionMatrixSizes.Large:
                this.size = ConfusionMatrixSizes.Medium;
                return this.sizeChange.emit(this.size);
            case ConfusionMatrixSizes.Medium:
                this.size = ConfusionMatrixSizes.Small;
                return this.sizeChange.emit(this.size);
        }
    }

    matrixValueChange(event: any, row: number, column: number) {
        const value = parseInt(event.target.innerText);
        if (!isNaN(value)) {
            this._confusionMatrix.matrix[row][column] = value;
            this.confusionMatrixChange.emit(this._confusionMatrix);
        } else {
            event.target.value = this._confusionMatrix.matrix[row][column];
        }


    }

    calculateInputSize(event: any) {
        const size = event.target.value.length * 2;
        event.target.style.width = `${size}px`;
    }

    changeLabel(event: any, index: number) {
        this._confusionMatrix.labels[index] = event.target.innerText ?? this._confusionMatrix.labels[index];
        this.confusionMatrixChange.emit(this._confusionMatrix);
    }

    /**
     * Gets the square size for each confusion matrix value.
     * @returns The square size.
     */
    private getSquareSize(): number {
        const _rows = this.rows?.nativeElement;
        if (_rows) {
            const row = _rows.getElementsByClassName('row')[0];
            if (row) {
                return row.clientWidth;
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
     * Deep copies a given object.
     * @param object The object to be deep copied.
     * @returns The deep copied object.
     */
    private deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }

}
