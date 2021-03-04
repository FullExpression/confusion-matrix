/**
 * Confusion matrix model which summarizes the prediction results on a classification problem.
 * 
 * The number of correct/incorrect predictions are summarized with count values and grouped by each class.
 * 
 * The matrix columns represents the true classes and the columns the predicted classes.
 *
 * @note Consult [wikipedia](https://en.wikipedia.org/wiki/Confusion_matrix) and [Joydwip Mohajon, 2020](https://towardsdatascience.com/confusion-matrix-for-your-multi-class-machine-learning-model-ff9aa3bf7826)
 * for more information regarding terminology, formulas and other theoretical concepts.
 *
 */
export class ConfusionMatrix {

    /** Confusion matrix labels */
    labels = new Array<string>();

    /** 
     * Confusion matrix values. 
     * 
     * The columns represents the true classes and the columns the predicted classes.
     */
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
     * @note Can be special util if you want to convert the values to percentage or between [0, 1].
     * 
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
                    this.matrix[i][j] = ((max - min) * ((x - minX) / (maxX - minX))) + min;
                    if (fractionDigits != undefined) {
                        this.matrix[i][j] = +this.matrix[i][j].toFixed(fractionDigits);
                    }

                }
            }
        } else {
            throw new Error("Error getting the min and max value. Please, verify the matrix dimensions.");
        }

    }

    /**
     * Gives the overall accuracy value for a given label or for all confusion matrix.
     *
     * Formula:
     *
     * accuracy = (TP + TN) / (TP + TN + FP + FN)
     *
     * @param configuration Set of configurations used on accuracy calculations.
     *
     * [[configuration.label]] : The label name which will be used to calculate the accuracy value.
     * If undefined or null, the accuracy value will be calculated for all confusion matrix.
     *
     * [[configuration.average]]: Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[configuration.average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * accuracy formula.
     *
     * [[configuration.average.Macro]]: Calculates and sums the accuracy for each individual label and divides for
     * the number of labels.
     *
     * [[configuration.average.Weighted]]: Defines if the accuracy calculations should be weighted. This means the labels
     * with more predictions will weight more in the final accuracy value comparing with labels with less.
     * predictions.
     *
     * @return The accuracy value.
     */
    accuracy(configuration: {
        label?: string,
        average?: Average
    } = { average: Average.Weighted }): number {
        this.validateMatrix();
        if (configuration?.label && configuration?.label.length > 0) {
            return this.labelAccuracy(configuration.label);
        }
        return this.matrixAccuracy(configuration?.average);

    }

    /**
     * Gives the accuracy value for a given matrix label.
     * 
     * Formula:
     *
     * accuracy = (TP + TN) / (TP + TN + FP + FN)
     * 
     * @param label The label used to get the accuracy value.
     * @return Accuracy value for a given label.
     */
    labelAccuracy(label: string): number {
        this.validateMatrix();
        const { truePositive, trueNegative, falsePositive, falseNegative } = this.getConfusionMatrixClasses(label);
        const result = (truePositive + trueNegative) / (truePositive + trueNegative + falsePositive + falseNegative);
        return result || 0;
    }

    /**
     * Gives the accuracy value for all confusion matrix, taking in account a given 
     * average method of calculation.
     * 
     * @param average Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * accuracy formula.
     *
     * [[average.Macro]]: Calculates and sums the accuracy for each individual label and divides for
     * the number of labels.
     *
     * [[average.Weighted]]: Defines if the accuracy calculations should be weighted. This means the labels
     * with more predictions will weight more in the final accuracy value comparing with labels with less.
     * predictions.
     * 
     * @return The accuracy value.
     */
    matrixAccuracy(average = Average.Weighted): number {
        this.validateMatrix();
        switch (average) {
            case Average.Micro: return this.microAccuracy();
            case Average.Macro: return this.macroAccuracy();
            case Average.Weighted: return this.weightedAccuracy();
        }
    }

    microAccuracy(): number {
        const { truePositive, trueNegative, falsePositive, falseNegative } = this.getSumConfusionMatrixClasses();
        const result = (truePositive + trueNegative) / (truePositive + trueNegative + falsePositive + falseNegative);
        return result || 0;
    }

    macroAccuracy(): number {
        let sum = 0;
        this.labels.forEach((label) => sum += this.labelAccuracy(label));
        const result = sum / this.labels.length;
        return result || 0;
    }

    weightedAccuracy(): number {
        const sumLabels = this.getLabelsPredictionsSum();
        const numberOfPredictions = this.getNumberOfPredictions();
        let sum = 0;
        this.labels.forEach((label, index) => sum += (this.labelAccuracy(label) * sumLabels[index]));
        const result = sum / numberOfPredictions;
        return result || 0;
    }

    /**
     * Misclassification rate, also know as classification error and 1-Accuracy, 
     * calculates the faction of predictions were incorrect.
     *
     * Formula:
     *
     * accuracy = (FP + FN) / (TP + TN + FP + FN)
     *
     * @param configuration Set of configurations used on miss classification rate calculations.
     *
     * [[configuration.label]] : The label name which will be used to calculate the miss classification rate.
     * If undefined or null, the value will be calculated for all confusion matrix.
     *
     * [[configuration.average]]: Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[configuration.average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * miss classification formula.
     *
     * [[configuration.average.Macro]]: Calculates and sums the miss classification rate for each individual label and divides for
     * the number of labels.
     *
     * [[configuration.average.Weighted]]: Defines if the miss classification calculations should be weighted. This means the labels
     * with more predictions will weight more in the final rate value comparing with labels with less predictions.
     *
     * @return The miss classification rate value.
     */
    missClassificationRate(configuration: {
        label?: string,
        average?: Average
    } = { average: Average.Weighted }): number {
        this.validateMatrix();
        if (configuration?.label && configuration?.label.length > 0) {
            return this.labelMissClassificationRate(configuration.label);
        }
        return this.matrixMissClassificationRate(configuration?.average);
    }

    /**
     * Gives the miss classification rate for a given matrix label.
     * 
     * Misclassification rate, also know as classification error and 1-Accuracy,
     * calculates the faction of predictions were incorrect.
     * 
     * Formula:
     *
     * missClassification = (FP + FN) / (TP + TN + FP + FN)
     *
     * @param label The label used to get the miss classification rate value.
     * @return Miss classification rate for a given label.
     */
    labelMissClassificationRate(label: string): number {
        this.validateMatrix();
        const { truePositive, trueNegative, falsePositive, falseNegative } = this.getConfusionMatrixClasses(label);
        const result = (falsePositive + falseNegative) / (truePositive + trueNegative + falsePositive + falseNegative);
        return result || 0;
    }

    /**
     * Gives the miss classification rate value for all confusion matrix, 
     * taking in account a given average method of calculation.
     * 
     * Misclassification rate, also know as classification error and 1-Accuracy,
     * calculates the faction of predictions were incorrect.
     * 
     * @param average Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * miss classification formula.
     *
     * [[average.Macro]]: Calculates and sums the miss classification for each individual label and divides for
     * the number of labels.
     *
     * [[average.Weighted]]: Defines if the miss classification calculations should be weighted. This means the labels
     * with more predictions will weight more in the final miss classification value comparing with labels with less.
     * predictions.
     *
     * @return The miss classification value.
     */
    matrixMissClassificationRate(average = Average.Weighted): number {
        this.validateMatrix();
        switch (average) {
            case Average.Micro: return this.microMissClassificationRate();
            case Average.Macro: return this.macroMissClassificationRate();
            case Average.Weighted: return this.weightedMissClassificationRate();
        }
    }

    microMissClassificationRate(): number {
        const { truePositive, trueNegative, falsePositive, falseNegative } = this.getSumConfusionMatrixClasses();
        const result = (falsePositive + falseNegative) / (truePositive + trueNegative + falsePositive + falseNegative);
        return result || 0;
    }

    macroMissClassificationRate(): number {
        let sum = 0;
        this.labels.forEach((label) => sum += this.labelMissClassificationRate(label));
        const result = sum / this.labels.length;
        return result || 0;
    }

    weightedMissClassificationRate(): number {
        const sumLabels = this.getLabelsPredictionsSum();
        const numberOfPredictions = this.getNumberOfPredictions();
        let sum = 0;
        this.labels.forEach((label, index) => sum += (this.labelMissClassificationRate(label) * sumLabels[index]));
        const result = sum / numberOfPredictions;
        return result || 0;
    }

    /**
     * Precision, gives what fraction of predictions as a positive class were actual positive.
     *
     * Formula:
     *
     * precision = (TP) / (TP + FP)
     *
     * @param configuration Set of configurations used on precision calculations.
     *
     * [[configuration.label]] : The label name which will be used to calculate the precision value.
     * If undefined or null, the value will be calculated for all confusion matrix.
     *
     * [[configuration.average]]: Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[configuration.average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * precision formula.
     *
     * [[configuration.average.Macro]]: Calculates and sums the miss classification rate for each individual label and divides for
     * the number of labels.
     *
     * [[configuration.average.Weighted]]: Defines if the precision calculations should be weighted. This means the labels
     * with more predictions will weight more in the final value comparing with labels with less predictions.
     *
     * @return The precision value.
     */
    precision(configuration: {
        label?: string,
        average?: Average
    } = { average: Average.Weighted }): number {
        this.validateMatrix();
        if (configuration?.label && configuration?.label.length > 0) {
            return this.labelPrecision(configuration.label);
        }
        return this.matrixPrecision(configuration?.average);
    }

    /**
     * Gives the precision value for a given matrix label.
     * 
     * Precision, stands for what fraction of predictions as a positive class were actual positive.
     * 
     * Formula:
     *
     * precision = (TP) / (TP + FP)
     *
     * @param label The label used to get the precision value.
     * @return Precision value for a given label.
     */
    labelPrecision(label: string): number {
        this.validateMatrix();
        const { truePositive, falsePositive } = this.getConfusionMatrixClasses(label);
        const result = ((truePositive) / (truePositive + falsePositive));
        return result || 0;
    }

    /**
     * Gives the precision value for all confusion matrix,
     * taking in account a given average method of calculation.
     *
     * Precision, stands for what fraction of predictions as a positive class were actual positive.
     *
     * @param average Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * precision formula.
     *
     * [[average.Macro]]: Calculates and sums the precision for each individual label and divides for
     * the number of labels.
     *
     * [[average.Weighted]]: Defines if the precision calculations should be weighted. This means the labels
     * with more predictions will weight more in the final precision value comparing with labels with less.
     * predictions.
     *
     * @return The precision value.
     */
    matrixPrecision(average = Average.Weighted): number {
        this.validateMatrix();
        switch (average) {
            case Average.Micro: return this.microPrecision();
            case Average.Macro: return this.macroPrecision();
            case Average.Weighted: return this.weightedPrecision();
        }
    }

    microPrecision(): number {
        const { truePositive, falsePositive } = this.getSumConfusionMatrixClasses();
        const result = ((truePositive) / (truePositive + falsePositive));
        return result || 0;
    }

    macroPrecision(): number {
        let sum = 0;
        this.labels.forEach((label) => sum += this.labelPrecision(label));
        const result = sum / this.labels.length;
        return result || 0;
    }

    weightedPrecision(): number {
        const sumLabels = this.getLabelsPredictionsSum();
        const numberOfPredictions = this.getNumberOfPredictions();

        let sum = 0;
        this.labels.forEach((label, index) => sum += (this.labelPrecision(label) * sumLabels[index]));
        const result = sum / numberOfPredictions;
        return result || 0;
    }

    /**
     * Recall, also know as true positive rate, sensitivity, hit rate and probability of detection,
     * gives what fraction of all positives classes correctly predicted as positive.
     *
     * Formula:
     *
     * recall = TP / (TP + FN)
     *
     * @param configuration Set of configurations used on recall calculations.
     *
     * [[configuration.label]] : The label name which will be used to calculate the recall value.
     * If undefined or null, the value will be calculated for all confusion matrix.
     *
     * [[configuration.average]]: Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[configuration.average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * recall formula.
     *
     * [[configuration.average.Macro]]: Calculates and sums the miss classification rate for each individual label and divides for
     * the number of labels.
     *
     * [[configuration.average.Weighted]]: Defines if the recall calculations should be weighted. This means the labels
     * with more predictions will weight more in the final value comparing with labels with less predictions.
     *
     * @return The recall value.
     */
    recall(configuration: {
        label?: string,
        average?: Average
    } = { average: Average.Weighted }): number {
        this.validateMatrix();
        if (configuration?.label && configuration?.label.length > 0) {
            return this.labelRecall(configuration.label);
        }
        return this.matrixRecall(configuration?.average);
    }

    /**
     * Gives the recall value for a given matrix label.
     *
     * Recall, also know as true positive rate, sensitivity, hit rate and probability of detection,
     * gives what fraction of all positives classes correctly predicted as positive.
     *
     * Formula:
     *
     * recall = TP / (TP + FN)
     *
     * @param label The label used to get the recall value.
     * @return Recall value for a given label.
     */
    labelRecall(label: string): number {
        this.validateMatrix();
        const { truePositive, falseNegative } = this.getConfusionMatrixClasses(label);
        const result = ((truePositive) / (truePositive + falseNegative));
        return result || 0;
    }

    /**
     * Gives the recall value for all confusion matrix,
     * taking in account a given average method of calculation.
     *
     * Recall, also know as true positive rate, sensitivity, hit rate and probability of detection,
     * gives what fraction of all positives classes correctly predicted as positive.
     *
     * @param average Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * recall formula.
     *
     * [[average.Macro]]: Calculates and sums the recall for each individual label and divides for
     * the number of labels.
     *
     * [[average.Weighted]]: Defines if the recall calculations should be weighted. This means the labels
     * with more predictions will weight more in the final recall value comparing with labels with less.
     * predictions.
     *
     * @return The recall value.
     */
    matrixRecall(average = Average.Weighted): number {
        this.validateMatrix();
        switch (average) {
            case Average.Micro: return this.microRecall();
            case Average.Macro: return this.macroRecall();
            case Average.Weighted: return this.weightedRecall();
        }
    }

    microRecall(): number {
        const { truePositive, falseNegative } = this.getSumConfusionMatrixClasses();
        const result = (truePositive) / (truePositive + falseNegative);
        return result || 0;
    }

    macroRecall(): number {
        let sum = 0;
        this.labels.forEach((label) => sum += this.labelRecall(label));
        const result = sum / this.labels.length;
        return result || 0;
    }

    weightedRecall(): number {
        const sumLabels = this.getLabelsPredictionsSum();
        const numberOfPredictions = this.getNumberOfPredictions();

        let sum = 0;
        this.labels.forEach((label, index) => sum += (this.labelRecall(label) * sumLabels[index]));
        const result = sum / numberOfPredictions;
        return result || 0;
    }

    /**
     * Specificity also know as selectivity or true negative rate,
     * gives what fraction of all negatives samples are correctly as negative.
     *
     * Formula:
     *
     * specificity = TP / (TN + FN)
     *
     * @param configuration Set of configurations used on specificity calculations.
     *
     * [[configuration.label]] : The label name which will be used to calculate the specificity value.
     * If undefined or null, the value will be calculated for all confusion matrix.
     *
     * [[configuration.average]]: Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[configuration.average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * specificity formula.
     *
     * [[configuration.average.Macro]]: Calculates and sums the miss classification rate for each individual label and divides for
     * the number of labels.
     *
     * [[configuration.average.Weighted]]: Defines if the specificity calculations should be weighted. This means the labels
     * with more predictions will weight more in the final value comparing with labels with less predictions.
     *
     * @return The specificity value.
     */
    specificity(configuration: {
        label?: string,
        average?: Average
    } = { average: Average.Weighted }): number {
        this.validateMatrix();
        if (configuration?.label && configuration?.label.length > 0) {
            return this.labelSpecificity(configuration.label);
        }
        return this.matrixSpecificity(configuration?.average);
    }

    /**
     * Gives the specificity value for all confusion matrix,
     * taking in account a given average method of calculation.
     *
     * Specificity also know as selectivity or true negative rate,
     * gives what fraction of all negatives samples are correctly as negative.
     *
     * @param average Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * specificity formula.
     *
     * [[average.Macro]]: Calculates and sums the specificity for each individual label and divides for
     * the number of labels.
     *
     * [[average.Weighted]]: Defines if the specificity calculations should be weighted. This means the labels
     * with more predictions will weight more in the final specificity value comparing with labels with less.
     * predictions.
     *
     * @return The specificity value.
     */
    matrixSpecificity(average = Average.Weighted): number {
        this.validateMatrix();
        switch (average) {
            case Average.Micro: return this.microSpecificity();
            case Average.Macro: return this.macroSpecificity();
            case Average.Weighted: return this.weightedSpecificity();
        }
    }

    microSpecificity(): number {
        const { trueNegative, falsePositive } = this.getSumConfusionMatrixClasses();
        const result = (trueNegative) / (trueNegative + falsePositive);
        return result || 0;
    }

    macroSpecificity(): number {
        let sum = 0;
        this.labels.forEach((label) => sum += this.labelSpecificity(label));
        const result = sum / this.labels.length;
        return result || 0;
    }

    weightedSpecificity(): number {
        const sumLabels = this.getLabelsPredictionsSum();
        const numberOfPredictions = this.getNumberOfPredictions();

        let sum = 0;
        this.labels.forEach((label, index) => sum += (this.labelSpecificity(label) * sumLabels[index]));
        const result = sum / numberOfPredictions;
        return result || 0;
    }

    /**
     * Gives the specificity value for a given matrix label.
     *
     * Specificity also know as selectivity or true negative rate,
     * gives what fraction of all negatives samples are correctly as negative.
     *
     * Formula:
     *
     * specificity = TP / (TN + FN)
     *
     * @param label The label used to get the specificity value.
     * @return Specificity value for a given label.
     */
    labelSpecificity(label: string): number {
        this.validateMatrix();
        const { trueNegative, falsePositive } = this.getConfusionMatrixClasses(label);
        const result = (trueNegative) / (trueNegative + falsePositive);
        return result || 0;
    }

    /**
     * F1 Score is the harmonic mean of precision and recall. 
     *
     * Formula:
     *
     * f1Score = TP / (TN + FN)
     *
     * @param configuration Set of configurations used on F1 Score calculations.
     *
     * [[configuration.label]] : The label name which will be used to calculate the F1 Score value.
     * If undefined or null, the value will be calculated for all confusion matrix.
     *
     * [[configuration.average]]: Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[configuration.average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * F1 Score formula.
     *
     * [[configuration.average.Macro]]: Calculates and sums the miss classification rate for each individual label and divides for
     * the number of labels.
     *
     * [[configuration.average.Weighted]]: Defines if the F1 Score calculations should be weighted. This means the labels
     * with more predictions will weight more in the final value comparing with labels with less predictions.
     *
     * @return The F1 Score value.
     */
    f1Score(configuration?: {
        label?: string,
        average?: Average
    }): number {
        this.validateMatrix();
        if (configuration?.label && configuration?.label.length > 0) {
            return this.labelF1Score(configuration.label);
        }
        return this.matrixF1Score(configuration?.average);
    }

    /**
     * Gives the F1 Score value for all confusion matrix,
     * taking in account a given average method of calculation.
     *
     * F1 Score is the harmonic mean of precision and recall.
     *
     * @param average Defines which type of average should be used. This average will only be taken in account.
     * on matrix calculations (when label = null || undefined).
     *
     * [[average.Micro]]: Calculates the TP, TN, FP and FN for the matrix globally and then applies the
     * F1 Score formula.
     *
     * [[average.Macro]]: Calculates and sums the F1 Score for each individual label and divides for
     * the number of labels.
     *
     * [[average.Weighted]]: Defines if the F1 Score calculations should be weighted. This means the labels
     * with more predictions will weight more in the final F1 Score value comparing with labels with less.
     * predictions.
     *
     * @return The F1 Score value.
     */
    matrixF1Score(average = Average.Weighted): number {
        this.validateMatrix();
        switch (average) {
            case Average.Micro: return this.microF1Score();
            case Average.Macro: return this.macroF1Score();
            case Average.Weighted: return this.weightedF1Score();
        }
    }

    /**
     * Gives the F1 Score value for a given matrix label.
     *
     * F1 Score is the harmonic mean of precision and recall.
     *
     * Formula:
     *
     * f1Score = TP / (TN + FN)
     * 
     * @param label The label used to get theF 1 Score value.
     * @return F1 Score value for a given label.
     */
    labelF1Score(label: string): number {
        this.validateMatrix();
        const precision = this.precision({ label });
        const recall = this.recall({ label });
        const result = 2 * ((precision * recall) / (precision + recall));
        return result || 0;
    }

    microF1Score() {
        const precision = this.microPrecision();
        const recall = this.microRecall()
        return this.applyF1ScoreFormula(precision, recall);
    }

    macroF1Score(): number {
        let sum = 0;
        this.labels.forEach((label) => sum += this.labelF1Score(label));
        const result = sum / this.labels.length;
        return result || 0;
    }

    weightedF1Score(): number {
        const sumLabels = this.getLabelsPredictionsSum();
        const numberOfPredictions = this.getNumberOfPredictions();

        let sum = 0;
        this.labels.forEach((label, index) => sum += (this.labelF1Score(label) * sumLabels[index]));
        const result = sum / numberOfPredictions;
        return result || 0;
    }

    /**
     * Get all matrix classes, containing information about true positives, true negatives, 
     * false positives and false negatives, as well as the label associated with it.
     * 
     * @return An array of matrix classes containing information about true positives, true negatives,
     * false positives and false negatives, as well as the label associated with it.
     *
     * @note Consult [wikipedia](https://en.wikipedia.org/wiki/Confusion_matrix) for more
     * information regarding terminology, formulas and other theoretical concepts.
     */
    getAllMatrixClasses(): Array<{ label: string, confusionMatrixClasses: ConfusionMatrixClasses }> {
        this.validateMatrix();
        const all = new Array<{ label: string, confusionMatrixClasses: ConfusionMatrixClasses }>();
        this.labels.forEach((label) => all.push({
            label: label,
            confusionMatrixClasses: this.getConfusionMatrixClasses(label)
        }));
        return all;
    }

    getSumConfusionMatrixClasses(): ConfusionMatrixClasses {
        const classesSum: ConfusionMatrixClasses = {
            truePositive: 0,
            trueNegative: 0,
            falsePositive: 0,
            falseNegative: 0
        }
        const classes = this.getAllMatrixClasses();
        classes.forEach((value) => {
            classesSum.truePositive += value.confusionMatrixClasses.truePositive;
            classesSum.trueNegative += value.confusionMatrixClasses.trueNegative;
            classesSum.falsePositive += value.confusionMatrixClasses.falsePositive;
            classesSum.falseNegative += value.confusionMatrixClasses.falseNegative;
        });
        return classesSum;
    }

    /**
     * For one given label, returns the matrix classes (true positives, true negatives,
     * false positives and false negatives).
     * 
     * @return The matrix classes (true positives, true negatives,
     * false positives and false negatives).
     * 
     * @note Consult [wikipedia](https://en.wikipedia.org/wiki/Confusion_matrix) for more
     * information regarding terminology, formulas and other theoretical concepts.
     */
    getConfusionMatrixClasses(label: string): ConfusionMatrixClasses {
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


    private applyF1ScoreFormula(precision: number, recall: number): number {
        return 2 * ((precision * recall) / (precision + recall));
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

export enum Average {
    Micro,
    Macro,
    Weighted
}

/**
 * 
 */
export interface ConfusionMatrixClasses {
    truePositive: number;
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
}

type FractionDigits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
    13 | 14 | 15 | 16 | 17 | 18 | 19 | 20