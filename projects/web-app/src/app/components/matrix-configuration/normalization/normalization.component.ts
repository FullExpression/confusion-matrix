import { Component, EventEmitter, Input, Output } from '@angular/core';
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

    changeMinValue(event: any) {
        this.min = Number(event.target.value ?? this.min);
        this.confusionMatrix.revertNormalization();
        this.confusionMatrix.normalize(this.min, this.max);
        this.confusionMatrix = this.confusionMatrix.clone();
    }

    changeMaxValue(event: any) {
        this.max = Number(event.target.value ?? this.max);
        this.confusionMatrix.revertNormalization();
        this.confusionMatrix.normalize(this.min, this.max);
        this.confusionMatrixChange.emit(this.confusionMatrix);
    }

    changeCheckboxValue(event: any) {
        this.normalizeCheckboxValue = event.checked;
        if (this.normalizeCheckboxValue) {
            this.confusionMatrix.normalize(this.min, this.max);
        } else {
            this.confusionMatrix.revertNormalization();
        }

        this.confusionMatrixChange.emit(this.confusionMatrix);
    }

}