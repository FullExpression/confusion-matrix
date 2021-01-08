import { JsonPipe } from "@angular/common";

export enum ConfusionMatrixSizes {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    ExtraLarge = 'extra-large'
}

export class ConfusionMatrix {
    labels = new Array<string>();
    matrix = new Array<Array<number>>();
    normalizations = new Array<ConfusionMatrix>();

    constructor(confusionMatrix?: { labels: Array<string>, matrix: Array<Array<number>> }) {
        if (confusionMatrix) {
            this.labels = this.deepCopy(confusionMatrix.labels);
            this.matrix = this.deepCopy(confusionMatrix.matrix);
        }
    }

    setConfusionMatrix(confusionMatrix: ConfusionMatrix) {
        this.labels = this.deepCopy(confusionMatrix.labels);
        this.matrix = this.deepCopy(confusionMatrix.matrix);
    }

    normalize(min: number = 0, max: number = 1) {
        const matrixMinMax = this.getMinAndMax();
        if (matrixMinMax) {
            this.normalizations.push(new ConfusionMatrix(this));
            const ratio = matrixMinMax?.max / (max - min);
            for (let i = 0; i < this.matrix.length; i++) {
                for (let j = 0; j < this.matrix[i].length; j++) {
                    this.matrix[i][j] = min + (this.matrix[i][j] / ratio);
                }
            }
        }
    }

    revertNormalization() {
        if (this.normalizations.length > 0) {
            const cm = this.normalizations.pop();
            if (cm) {
                this.setConfusionMatrix(cm);
            }
        }
    }

    clone(): ConfusionMatrix {
        const cloneObj = new ConfusionMatrix({
            labels: this.labels,
            matrix: this.matrix,
        });
        cloneObj.normalizations = this.deepCopy(this.normalizations);
        return cloneObj;
    }

    private getMinAndMax(): { min: number, max: number } | undefined {
        let min = this.matrix[0][0];
        let max = this.matrix[0][0];

        if (!min || !max) {
            return undefined;
        }
        for (let line of this.matrix) {
            for (let val of line) {
                max = max < val ? val : max;
                min = min > val ? val : min;
            }
        }

        return { min, max };
    }

    private deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }
}