import { NgIf } from "@angular/common";

/**
 * Confusion matrix model.
 */
export class ConfusionMatrix {
    /** Confusion matrix labels. */
    labels = new Array<string>();

    /** Confusion matrix values. */
    matrix = new Array<Array<number>>();

    /** Normalization history values. */
    private normalizations = new Array<ConfusionMatrix>();

    /**
     * Creates new instance of confusion matrix.
     * 
     * @example
     * <pre><code>
     * const confusionMatrix = new ConfusionMatrix({
     *   labels: ["Happiness", "Sadness"],
     *   matrix:
     *       [[1,2],
     *       [3,4]]
     *   });
     * </code><pre> 
     * @param confusionMatrix 
     */
    constructor(confusionMatrix?: { labels: Array<string>, matrix: Array<Array<number>> }) {
        if (confusionMatrix) {
            this.labels = this.deepCopy(confusionMatrix.labels);
            this.matrix = this.deepCopy(confusionMatrix.matrix);
        }
    }

    /**
     * Sets the confusion matrix value based on another confusion matrix.
     * @param confusionMatrix The confusion matrix.
     */
    setConfusionMatrix(confusionMatrix: ConfusionMatrix) {
        this.labels = this.deepCopy(confusionMatrix.labels);
        this.matrix = this.deepCopy(confusionMatrix.matrix);
    }

    /**
     * Normalizes all values of the matrix between two given values.
     * 
     * All normalizations will be saved in history and it is possible to revert last normalizations 
     * by calling the function @see {@link ConfusionMatrix.revertNormalization}.
     * 
     * Can be util if you want to convert the values to percentage or between [0, 1].
     * @param min Minimum value of the normalized range values [min, max].
     * @param max Maximum value of the normalized range values [min, max]. 
     */
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
        this.normalize()
    }

    /**
     * Reverts the last normalization occur getting the current confusion matrix.
     * @return The confusion matrix object before the normalization. 
     * If there is not any entry on the history, null will be returned.
     */
    revertNormalization(): ConfusionMatrix | null {
        if (this.normalizations.length > 0) {
            const cm = this.normalizations.pop();
            if (cm) {
                this.setConfusionMatrix(cm);
            }
        }
        return null;
    }

    /** 
     * Deep clones and return the current confusion matrix.
     * @return The deep cloned confusion matrix object. 
     * */
    clone(): ConfusionMatrix {
        const cloneObj = new ConfusionMatrix({
            labels: this.labels,
            matrix: this.matrix,
        });
        cloneObj.normalizations = this.deepCopy(this.normalizations);
        return cloneObj;
    }

    /**
     * Gets the confusion matrix min and max value.
     * @return Min and max confusion matrix value or null if not exists.
     */
    getMinAndMax(): { min: number, max: number } | null {
        let min = this.matrix[0][0];
        let max = this.matrix[0][0];

        if (!min || !max) {
            return null;
        }
        for (let line of this.matrix) {
            for (let val of line) {
                max = max < val ? val : max;
                min = min > val ? val : min;
            }
        }

        return { min, max };
    }

    /**
     * Deep copies a given object.
     * @param object The object to be deep cloned.
     * @return The deep cloned object.
     */
    private deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }
}

/**
 * Different sizes available for the confusion matrix visual component.
 */
export enum ConfusionMatrixSizes {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    ExtraLarge = 'extra-large'
}