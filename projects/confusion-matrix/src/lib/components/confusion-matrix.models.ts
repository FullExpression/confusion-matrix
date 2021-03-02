/**
 * Confusion matrix model.
 */
export class ConfusionMatrix {

    /** Confusion matrix labels */
    labels = new Array<string>();

    /** Local confusion matrix values */
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
        this.validateMatrix();
    }

    /**
     * Sets the confusion matrix value based on another confusion matrix.
     * @param confusionMatrix The confusion matrix.
     */
    setConfusionMatrix(confusionMatrix: ConfusionMatrix) {
        if (confusionMatrix) {
            this.labels = this.deepCopy(confusionMatrix.labels);
            this.matrix = this.deepCopy(confusionMatrix.matrix);
        }
        this.validateMatrix();
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
     * @param fractionDigits — Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
     */
    normalize(min: number = 0, max: number = 1, fractionDigits?: FractionDigits) {
        if (min >= max) {
            throw "Min value cannot be equal or greater than max value.";
        }

        this.validateMatrix();
        const matrixMinMax = this.getMinAndMax();
        if (matrixMinMax) {
            this.normalizations.push(new ConfusionMatrix(this));
            const minX = matrixMinMax.min;
            const maxX = matrixMinMax.max;
            for (let i = 0; i < this.matrix.length; i++) {
                for (let j = 0; j < this.matrix[i].length; j++) {
                    const x = this.matrix[i][j];
                    this.matrix[i][j] = ((max - min) * ((x - minX) / (maxX - minX))) + min
                    if (fractionDigits != undefined) {
                        this.matrix[i][j] = +this.matrix[i][j].toFixed(fractionDigits);
                    }

                }
            }
        }
    }

    /**
     * Gives the overall accuracy value for a given label or for the all confusion matrix.
     *  
     * Formula: 
     * 
     * labelAccuracy = (TP + TN) / (TP + TN + FP + FN)
     * 
     * allMatrix = Sum(n)(labelAccuracy[n])
     * 
     * labelWeight[] = (numberOfLabelPredictions / totalNumberOfPredictions) (repeat for each label);
     * 
     * allMatrixWeight =  Sum(n)(labelAccuracy[n] * labelWeight[n])
     * 
     * @param configuration Allows not set some configuration when calculating the accuracy number.
     * 
     * [[configuration.label]] : The label name which will be used to calculate the accuracy value.
     * If undefined or null, will the accuracy value will be calculated for the all confusion matrix.
     * 
     * [[configuration.weighted]]: Defines if the accuracy value should be weighted. This means that the labels
     * with more predictions will weight more in the final accuracy value comparing with labels with less
     * predictions. Note: The weight will only be taken in account when the accuracy is being calculated to the all
     * confusion matrix.
     * 
     * @return The accuracy value.
     */
    accuracy(configuration?: {
        label?: string,
        weighted?: boolean
    }): number {
        this.validateMatrix();
        if (configuration?.label && configuration?.label.length > 0) {

            return this.labelAccuracy(configuration.label);
        }
        return this.matrixAccuracy(configuration?.weighted);
    }

    /**
     * Gives the accuracy value for a given matrix label.
     * 
     * Formula:
     *
     * labelAccuracy = (TP + TN) / (TP + TN + FP + FN)
     * 
     * @param label The label used to get the accuracy value.
     * @return Accuracy value for a given label.
     */
    labelAccuracy(label: string): number {
        this.validateMatrix();
        const { truePositive, trueNegative, falsePositive, falseNegative } = this.getTrueClasses(label);
        return (truePositive + trueNegative) / (truePositive + trueNegative + falsePositive + falseNegative);
    }

    /**
     * Gives the overall accuracy value for confusion matrix.
     *
     * Formula:
     *
     * labelAccuracy = (TP + TN) / (TP + TN + FP + FN)
     *
     * allMatrix = Sum(n)(labelAccuracy[n])
     *
     * labelWeight[] = (numberOfLabelPredictions / totalNumberOfPredictions) (repeat for each label);
     *
     * allMatrixWeight =  Sum(n)(labelAccuracy[n] * labelWeight[n])
     *
     * @param weighted Defines if the accuracy value should be weighted. This means that the labels
     * with more predictions will weight more in the final accuracy value comparing with labels with less
     * predictions.
     *
     * @return The accuracy value.
     */
    matrixAccuracy(weighted = false): number {
        this.validateMatrix();
        if (weighted) {
            const sumLabels = this.getLabelsPredictionsSum();
            const numberOfPredictions = this.getNumberOfPredictions();
            console.log(numberOfPredictions);
            console.log(sumLabels);
            let sum = 0;
            this.labels.forEach((label, index) => sum += (this.labelAccuracy(label) * sumLabels[index]));
            return sum / numberOfPredictions
        } else {
            let sum = 0;
            this.labels.forEach((label) => sum += this.labelAccuracy(label));
            return sum / this.labels.length;
        }

    }

    /**
     * Misclassification rate or 1-Accuracy, gives what fraction of predictions were incorrect.
     *
     * MISSING DOCUMENTATIOn
     *
     * @return The accuracy value.
     */
    missClassificationRate(configuration: {
        label?: string,
        weighted?: boolean
    }): number {
        this.validateMatrix();
        const { label, weighted } = configuration;
        if (label && label.length > 0) {
            return this.labelMissClassificationRate(label);
        }
        return this.matrixMissClassificationRate(weighted);
    }

    labelMissClassificationRate(label: string): number {
        this.validateMatrix();
        const { truePositive, trueNegative, falsePositive, falseNegative } = this.getTrueClasses(label);
        return (falsePositive + falseNegative) / (truePositive + trueNegative + falsePositive + falseNegative);
    }

    matrixMissClassificationRate(weighted?: boolean): number {
        this.validateMatrix();
        if (weighted) {
            const sumLabels = this.getLabelsPredictionsSum();
            const numberOfPredictions = this.getNumberOfPredictions();
            let sum = 0;
            this.labels.forEach((label, index) => sum += (this.labelMissClassificationRate(label) * sumLabels[index]));
            return sum / numberOfPredictions;
        } else {
            let sum = 0;
            this.labels.forEach((label) => sum += this.labelMissClassificationRate(label));
            return sum / this.labels.length;
        }
    }

    getAllTrueClasses(): Array<{ label: string, trueClasses: TrueClasses }> {
        this.validateMatrix();
        const all = new Array<{ label: string, trueClasses: TrueClasses }>();
        this.labels.forEach((label) => all.push({
            label: label,
            trueClasses: this.getTrueClasses(label)
        }));
        return all;
    }

    getTrueClasses(label: string): TrueClasses {
        this.validateMatrix();
        if (!label) {
            throw new Error("A valid label should be passed.");
        }
        const position = this.labels.findIndex(element => element === label);
        if (position == -1) {
            throw new Error("The label does not exists in the matrix.");
        }

        const matrixSum = this.sumMatrix(this.matrix);
        const truePositive = this.matrix[position][position];
        const falsePositive = this.matrix[position].reduce(
            (previous, next) => previous + next) - truePositive;

        let falseNegative = 0;

        for (let i = 0; i < this.matrix.length; i++) {
            falseNegative += this.matrix[i][position];
        }

        falseNegative -= truePositive;
        const trueNegative = matrixSum - truePositive - falsePositive - falseNegative;

        return { truePositive, trueNegative, falsePositive, falseNegative };
    }

    precision(configuration: {
        label?: string,
        weighted?: boolean
    }): number {
        this.validateMatrix();
        const { label, weighted } = configuration;
        if (label && label.length > 0) {
            return this.labelPrecision(label);
        }
        return this.matrixPrecision(weighted);
    }

    labelPrecision(label: string): number {
        this.validateMatrix();
        const { truePositive, falsePositive } = this.getTrueClasses(label);
        return (truePositive) / (truePositive + falsePositive);
    }

    matrixPrecision(weighted = false): number {
        this.validateMatrix();
        if (weighted) {
            const sumLabels = this.getLabelsPredictionsSum();
            const numberOfPredictions = this.getNumberOfPredictions();

            let sum = 0;
            this.labels.forEach((label, index) => sum += (this.labelPrecision(label) * sumLabels[index]));
            return sum / numberOfPredictions
        } else {
            let sum = 0;
            this.labels.forEach((label) => sum += this.labelPrecision(label));
            return sum / this.labels.length;
        }
    }

    recall(configuration: {
        label?: string,
        weighted?: boolean
    }): number {
        this.validateMatrix();
        const { label, weighted } = configuration;
        if (label && label.length > 0) {
            return this.labelRecall(label);
        }
        return this.matrixRecall(weighted);
    }

    labelRecall(label: string): number {
        this.validateMatrix();
        const { truePositive, falseNegative } = this.getTrueClasses(label);
        return (truePositive) / (truePositive + falseNegative);
    }

    matrixRecall(weighted = false): number {
        this.validateMatrix();
        if (weighted) {
            const sumLabels = this.getLabelsPredictionsSum();
            const numberOfPredictions = this.getNumberOfPredictions();

            let sum = 0;
            this.labels.forEach((label, index) => sum += (this.labelRecall(label) * sumLabels[index]));
            return sum / numberOfPredictions
        } else {
            let sum = 0;
            this.labels.forEach((label) => sum += this.labelRecall(label));
            return sum / this.labels.length;
        }
    }

    specificity(configuration: {
        label?: string,
        weighted?: boolean
    }): number {
        this.validateMatrix();
        const { label, weighted } = configuration;
        if (label && label.length > 0) {
            return this.labelSpecificity(label);
        }
        return this.matrixSpecificity(weighted);
    }

    matrixSpecificity(weighted = false): number {
        this.validateMatrix();
        if (weighted) {
            const sumLabels = this.getLabelsPredictionsSum();
            const numberOfPredictions = this.getNumberOfPredictions();

            let sum = 0;
            this.labels.forEach((label, index) => sum += (this.labelRecall(label) * sumLabels[index]));
            return sum / numberOfPredictions
        } else {
            let sum = 0;
            this.labels.forEach((label) => sum += this.labelRecall(label));
            return sum / this.labels.length;
        }
    }

    labelSpecificity(label: string): number {
        this.validateMatrix();
        const { truePositive, falsePositive } = this.getTrueClasses(label);
        return (truePositive) / (truePositive + falsePositive);
    }

    truePositiveRate(): number {
        this.validateMatrix();
        throw "not implemented yet";
    }

    falsePositiveRate(configuration: {
        label?: string,
        weighted?: boolean
    }): number {
        this.validateMatrix();
        return 0;
    }

    trueNegativeRate(): number {
        this.validateMatrix();
        throw "not implemented yet";
    }



    prevalence(): number {
        this.validateMatrix();
        throw "not implemented yet";
    }

    nullErrorRate(): number {
        this.validateMatrix();
        throw "not implemented yet";
    }

    fScore(): number {
        this.validateMatrix();
        throw "not implemented yet";
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
     * Reverts all normalizations performed.
     */
    revertAllNormalizations() {
        this.setConfusionMatrix(this.normalizations[0]);
    }

    getNumberOfPredictions(label?: string): number {
        const sumLabels = this.getLabelsPredictionsSum();

        if (label && label.length > 0) {
            const index = this.labels.findIndex(value => value === label);
            return sumLabels[index];
        } else {
            const numberOfPredictions = sumLabels.reduce((prev, next) => prev + next);
            return numberOfPredictions;
        }
    }

    getLabelsPredictionsSum(): Array<number> {
        let sumLabels = new Array<number>(this.labels.length)
            .fill(0, 0, this.labels.length);
        this.matrix.forEach((array) =>
            array.forEach((value, index) => {
                sumLabels[index] += value;
            }));
        return sumLabels;
    }



    /**
     * Deep copies a given object.
     * @param object The object to be deep cloned.
     * @return The deep cloned object.
     */
    private deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }

    private sumMatrix(matrix: Array<Array<number>>) {
        let sum = 0;
        matrix.forEach(array => array.forEach(value => sum += value))
        return sum;
    }

    private validateMatrix() {
        if (this.labels.length !== this.matrix.length) {
            throw "The labels length should be equals to the matrix columns length."
        }

        for (let i = 0; i < this.labels.length - 1; i++) {
            for (let j = i + 1; j < this.labels.length; j++) {
                if (this.labels[i] === this.labels[j]) {
                    throw `The label ${this.labels[i]} appears more than once in the labels array.`;
                }
            }
        }

        this.matrix.forEach(array => {
            if (array.length !== this.matrix.length) {
                throw "The confusion matrix does not have the columns/rows length."
            }
        });
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

export interface TrueClasses {
    truePositive: number;
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
}

type FractionDigits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
    13 | 14 | 15 | 16 | 17 | 18 | 19 | 20