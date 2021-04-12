
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ConfusionMatrix } from '@fullexpression/confusion-matrix-stats';
import { DecimalPipe } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ConfigurationsOption } from './configurations/configurations.component.model';
import * as html2canvas from "html2canvas";
import { confusionMatrixAnimations } from './confusion-matrix.animations';
import { DownloadService } from '../services/download.service';
import { ImportService } from '../services/import.service';
import { IntensityBarService } from './intensity-bar/intensity-bar.service';

/**
 * Component which helps to visualize a confusion matrix.
 * As a set o function allowing some level of visual configuration.
 */
@Component({
    selector: 'confusion-matrix',
    templateUrl: './confusion-matrix.component.html',
    styleUrls: ['./confusion-matrix.component.scss'],
    animations: confusionMatrixAnimations
})
export class ConfusionMatrixComponent implements AfterViewInit {

    /**
     * Sets the confusion matrix title.
     * If undefined, the title reserved space will be hidden.
     */
    @Input()
    title = "";

    @Output()
    titleChange = new EventEmitter<string>();

    /**
     * Represents the confusion matrix size.
     */
    @Input()
    set zoom(zoom: number) {
        this.updateZoomValue(zoom, false);
    }

    @Output()
    zoomChange = new EventEmitter<number>();

    /**
     * Sets the confusion matrix color level (a.k.a color intensity).
     * Should be order asc from less intense (close to 0) to max intense (close to max value).
     */
    @Input()
    levelsColors = new Array<string>();

    @Output()
    levelsColorsChange = new EventEmitter<Array<string>>()

    /**
     * Sets the confusion matrix labels and values.
     */
    @Input()
    set confusionMatrix(value: ConfusionMatrix) {
        this._confusionMatrix = value.clone();
        this._confusionMatrixTransposed = this._confusionMatrix.clone();
        this._confusionMatrixTransposed.transpose();
        this.dragHighlight = new Array();
    }

    get confusionMatrix(): ConfusionMatrix {
        return this._confusionMatrix;
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

    get scale(): string {
        return `scale(${this._zoom})`
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

    editionMode = false;

    dragging = false;

    showMetricsPanel = false;

    showNormalizationConfiguration = false;

    _confusionMatrixTransposed = new ConfusionMatrix();

    private originalWidth = 0;
    private originalHeight = 0;
    private _zoom = 1;
    private fullyInitialized = false;
    private numberOfItemsAdded = 0;
    private dragIndex = -1;

    dragHighlight = new Array<boolean>();

    /**
     * Constructs the confusion matrix.
     * @decimalPipe Decimal angular service injected using dependency injection.
     */
    constructor(private decimalPipe: DecimalPipe,
        private host: ElementRef,
        private downloadService: DownloadService,
        private importService: ImportService,
        private intensityBarService: IntensityBarService) {

        this.confusionMatrixChange.subscribe(() => {
            new Array(this._confusionMatrix.labels.length);
        });
    }

    ngAfterViewInit(): void {
        this.fullyInitialized = true;
        this.originalWidth = this.host.nativeElement.clientWidth;
        this.originalHeight = this.host.nativeElement.clientHeight;
        this.updateZoomValue(this._zoom);
    }

    /**
     * Given a value, returns the color intensity associated with.
     * @return Color intensity in hexadecimal.
     */
    getColor(value: number): string {
        return this.intensityBarService.getColor(value);
    }

    getTranspose(): ConfusionMatrix {
        const clone = this._confusionMatrix.clone();
        clone.transpose();
        return clone;
    }

    /**
     * Downloads a image of the confusion matrix.
     * IT IS NOT YET FULLY IMPLEMENTED. BETA ONLY!
     */
    download() {
        (html2canvas as any)(this.confusionMatrixElement?.nativeElement).then((canvas: any) => {
            const link = document.createElement('a');
            link.download = 'confusion-matrix.png';
            link.href = canvas.toDataURL()
            link.click();
            link.remove();
        });
    }

    optionChanged(option: ConfigurationsOption) {

        switch (option) {
            case ConfigurationsOption.ZoomIn:
                this.zoomIn();
                break;
            case ConfigurationsOption.Download:
                this.download();
                break;
            case ConfigurationsOption.ZoomOut:
                this.zoomOut();
                break;
            case ConfigurationsOption.Transpose:
                this.transpose();
                break;
            case ConfigurationsOption.View:
                this.editionMode = false;
                this.updateZoomValue(this._zoom);
                break;
            case ConfigurationsOption.Edit:
                this.editionMode = true;
                this.updateZoomValue(this._zoom);
                break;
            case ConfigurationsOption.Save:
                this.save();
                break;
            case ConfigurationsOption.Import:
                this.import();
                break;
            case ConfigurationsOption.Normalization:
                this.showNormalizationConfiguration = true;
                break;

        }
    }
    zoomIn() {
        this._zoom += 0.1;
        this.zoomChange.emit(this._zoom);
    }

    zoomOut() {
        this._zoom -= 0.1;
        this.zoomChange.emit(this._zoom);
    }

    matrixValueChange(event: any, row: number, column: number) {
        const value = parseInt(event.target.innerText);
        if (!isNaN(value)) {
            this._confusionMatrix.matrix[row][column] = value;
            this._confusionMatrix.matrix = this._confusionMatrix.matrix;
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

    changeTitle(event: any) {
        this.title = event.target.innerText ?? this.title;
        this.titleChange.emit(this.title);

    }

    transpose() {
        this._confusionMatrix.transpose();
        this.confusionMatrixChange.emit(this._confusionMatrix);
    }

    undo() {
        this._confusionMatrix.undo();
        this.confusionMatrixChange.emit(this._confusionMatrix);
    }

    redo() {
        this._confusionMatrix.redo();
        this.confusionMatrixChange.emit(this._confusionMatrix);
    }

    // This function will delete a given label
    removeLabel(name: string) {
        this._confusionMatrix.removeLabel(name);
        this.confusionMatrixChange.emit(this._confusionMatrix);
        this.originalWidth -= 40;
        this.originalHeight -= 40;
        this.updateZoomValue(this._zoom);
    }

    add(index: number) {
        const emptyArray = new Array<number>(this._confusionMatrix.matrix.length + 1);
        emptyArray.fill(0, 0, this._confusionMatrix.matrix.length + 1);
        let name = 'Untitled';
        if (this.numberOfItemsAdded > 0) {
            name = `${name}-${this.numberOfItemsAdded}`;
        }
        this._confusionMatrix.addLabel(name, emptyArray, emptyArray, index);
        ++this.numberOfItemsAdded;
        this.confusionMatrixChange.emit(this._confusionMatrix);
        this.originalWidth += 40;
        this.originalHeight += 40;
        this.updateZoomValue(this._zoom);

    }

    dragstart(from: number) {
        this.dragIndex = from;
        this.dragging = true;
    }

    onDrop(target: number) {
        this._confusionMatrix.changeLabelOrder(this.dragIndex, target);
        this.confusionMatrixChange.emit(this._confusionMatrix);
    }

    allowDrop(event: any) {
        event.preventDefault();
        return false;
    }

    allowDrag() {
        return !this.editionMode;
    }

    dragEnter(index: number) {
        this.dragHighlight[index] = true;
    }

    dragExist(index: number) {
        this.dragHighlight[index] = false;
    }

    save() {
        this.downloadService.download(this._confusionMatrix.convertToJson(),
            'confusion-matrix.json');
    }

    async import() {
        const json = await this.importService.import();
        if (json) {
            this._confusionMatrix.importAsJson(json);
            this.confusionMatrixChange.emit(this._confusionMatrix);
        }
    }

    private onConfusionMatrixChange() {
        this.dragHighlight = new Array(this._confusionMatrix.labels.length);
    }

    private updateZoomValue(zoom: number, throwExceptions = true) {
        if (zoom < 0.2) {
            if (!throwExceptions) return;
            throw "Zoom can not be less then 0.2";
        }
        this._zoom = zoom;
        if (this.fullyInitialized) {
            const width = this.originalWidth + (this.editionMode ? 45 : 0);
            const height = this.originalHeight + (this.editionMode ? 45 : 0)
            this.host.nativeElement.style.width = `${width * this._zoom}px`;
            this.host.nativeElement.style.height = `${height * this._zoom}px`;
        }
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
     * Deep copies a given object.
     * @param object The object to be deep copied.
     * @returns The deep copied object.
     */
    private deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }

}
