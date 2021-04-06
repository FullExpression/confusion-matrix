import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";

@Component({
    selector: 'normalize',
    templateUrl: './normalize.component.html',
    styleUrls: ['./normalize.component.scss']
})
export class NormalizeComponent implements OnInit {

    @Input()
    visible = true;

    @Output()
    visibleChange = new EventEmitter<boolean>();

    @Input()
    confusionMatrix = new ConfusionMatrix();

    @Output()
    confusionMatrixChange = new EventEmitter<ConfusionMatrix>();

    @Input()
    min: number | undefined;

    @Output()
    minChange = new EventEmitter<number>();

    @Input()
    max: number | undefined;

    @Output()
    maxChange = new EventEmitter<number>();

    ngOnInit(): void {
        const minMax = this.confusionMatrix.getMinAndMax();
        if (this.min == undefined) {
            this.min = minMax?.min;
        }

        if (this.max == undefined) {
            this.max = minMax?.max;
        }
    }

    minValueChanged(value: number) {
        this.min = value;
        if (this.max == undefined || this.max < this.min) {
            this.max = this.min;
        }
        this.confusionMatrix.normalize(this.min, this.max);
        this.confusionMatrixChange.emit(this.confusionMatrix);
    }

    maxValueChanged(value: number) {
        this.max = value;
        if (this.min == undefined || this.max < this.min) {
            this.min = this.max;
        }
        this.confusionMatrix.normalize(this.min, this.max);
        this.confusionMatrixChange.emit(this.confusionMatrix);
    }

    reset() {
        this.confusionMatrix.revertAllNormalizations();
        const minMax = this.confusionMatrix.getMinAndMax();
        this.min = minMax?.min;
        this.max = minMax?.max;
        this.confusionMatrixChange.emit(this.confusionMatrix);
    }

}