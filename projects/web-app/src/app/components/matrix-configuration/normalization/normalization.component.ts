import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ConfusionMatrix } from 'projects/confusion-matrix/src/public-api';

@Component({
    selector: 'normalization',
    styleUrls: ['./normalization.component.scss'],
    templateUrl: 'normalization.component.html'
})

export class NormalizationComponent {


    @Input()
    confusionMatrix = new ConfusionMatrix();

    @Output()
    confusionMatrixChange = new EventEmitter<ConfusionMatrix>();

    normalizeCheckboxValue = false

    min = 0;
    max = 1;

    @ViewChild("minElement") minElement: ElementRef | undefined;

    @ViewChild("maxElement") maxElement: ElementRef | undefined;

    errorMessage = "";

    changeMinValue() {
        try {
            this.min = Number(this.minElement?.nativeElement.value ?? this.min);
            this.confusionMatrix.normalize(this.min, this.max);
            this.confusionMatrixChange.emit(this.confusionMatrix);
            this.errorMessage = "";
        } catch (error) {
            this.errorMessage = error;
        }

    }

    changeMaxValue() {
        try {
            this.max = Number(this.maxElement?.nativeElement.value ?? this.max);
            this.confusionMatrix.normalize(this.min, this.max);
            this.confusionMatrixChange.emit(this.confusionMatrix);
            this.errorMessage = "";
        } catch (error) {
            this.errorMessage = error;
        }

    }

    changeCheckboxValue(event: any) {
        this.normalizeCheckboxValue = event.checked;
        if (this.normalizeCheckboxValue) {
            this.confusionMatrix.normalize(this.min, this.max);
        } else {
            this.confusionMatrix.revertAllNormalizations();
        }

        this.confusionMatrixChange.emit(this.confusionMatrix);
    }


}