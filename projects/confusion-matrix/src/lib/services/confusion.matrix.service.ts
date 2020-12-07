import { Injectable } from '@angular/core';

@Injectable()
export class ConfusionMatrixService {

    constructor() { }

    getAccuracy(confusionMatrix: Array<Array<number>>): number {
        let correctClassifications = 0;
        let totalClassifications = 0;
        for (let i = 0; i < confusionMatrix.length; i++) {
            for (let j = 0; j < confusionMatrix[0].length; j++) {
                if (i == j) {
                    correctClassifications += confusionMatrix[i][j];
                }
                totalClassifications += confusionMatrix[i][j];
            }
        }
        return (correctClassifications / totalClassifications) * 100
    }

    getAfraidAccuracy(confusionMatrix: Array<Array<number>>): number {
        return this.getAccuracyForEmtoion(confusionMatrix, 0);
    }

    getAngryAccuracy(confusionMatrix: Array<Array<number>>): number {
        return this.getAccuracyForEmtoion(confusionMatrix, 1);
    }

    getDisgustedAccuracy(confusionMatrix: Array<Array<number>>): number {
        return this.getAccuracyForEmtoion(confusionMatrix, 2);
    }

    getHappyAccuracy(confusionMatrix: Array<Array<number>>): number {
        return this.getAccuracyForEmtoion(confusionMatrix, 3);
    }

    getNeutralAccuracy(confusionMatrix: Array<Array<number>>): number {
        return this.getAccuracyForEmtoion(confusionMatrix, 4);
    }

    getSadAccuracy(confusionMatrix: Array<Array<number>>): number {
        return this.getAccuracyForEmtoion(confusionMatrix, 5);
    }
    getSuprisedAccuracy(confusionMatrix: Array<Array<number>>): number {
        return this.getAccuracyForEmtoion(confusionMatrix, 6);
    }

    getAccuracyForEmtoion(confusionMatrix: Array<Array<number>>, position: number = 0): number {
        let correctClassifications = 0;
        let totalClassifications = 0;
        let j = position;
        for (let i = 0; i < confusionMatrix.length; i++) {
            if (i == j) {
                correctClassifications += confusionMatrix[i][j];
            }
            totalClassifications += confusionMatrix[i][j];
        }
        if (correctClassifications === 0 || totalClassifications === 0) {
            return 0
        } else {
            return (correctClassifications / totalClassifications) * 100;
        }

    }

    sumMatrix(matrix1: Array<Array<number>>, matrix2: Array<Array<number>>): Array<Array<number>> {
        for (let i = 0; i < matrix1.length; i++) {
            for (let j = 0; j < matrix1[0].length; j++) {
                matrix1[i][j] += matrix2[i][j];
            }
        }
        return matrix1;
    }

}