import { Injectable } from "@angular/core";
import { ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";

@Injectable()
export class IntensityBarService {

    levelsColors = new Array<string>();

    levelsStep = 0;

    /**
   * Updates the confusion matrix intensity bar.
   * @param confusionMatrix The new confusion matrix.
   */
    updateIntensityValues(confusionMatrix: ConfusionMatrix): void {
        let matrix = confusionMatrix.matrix;
        let max = matrix[0][0];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (max < matrix[i][j]) {
                    max = matrix[i][j];
                }
            }
        }
        this.levelsStep = max / this.levelsColors.length;
        if (this.levelsStep === Infinity) {
            this.levelsStep = 0;
        }
    }

    setLevelColors(colors: Array<string>) {
        this.levelsColors = colors;
    }

    /**
     * Given a value, returns the color intensity associated with.
     * @return Color intensity in hexadecimal.
     */
    getColor(value: number): string {
        const levelsNumber = this.levelsColors.length;
        for (let i = 1; i <= levelsNumber; i++) {
            if (this.levelsStep * i >= (value - (this.levelsStep / 2))) {
                return this.levelsColors[i - 1];
            }
        }
        return this.levelsColors[0];
    }


    /**
     * Gets the insensitive number for a given position of the intensity bar. 
     * @param index 
     * @returns 
     */
    getIntensityNumber(index: number): number {
        if (index === 0) {
            return 0;
        } else {
            if (this.levelsColors.length > this.levelsStep * this.levelsColors.length) {
                return (index + 1) * this.levelsStep;
            } else {
                return Math.round((index + 1) * this.levelsStep);
            }
        }
    }
}