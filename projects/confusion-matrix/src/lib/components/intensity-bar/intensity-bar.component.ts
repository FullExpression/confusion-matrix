import { DecimalPipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";
import { UtilService } from "../../services/util.service";
import { DialogService } from "../dialogs/dialog.service";
import { IntensityBarConfigurationComponent } from "./intensity-bar-configuration/intensity-bar-configuration.component";
import { IntensityBarService } from "./intensity-bar.service";

@Component({
    selector: 'intensity-bar',
    templateUrl: 'intensity-bar.component.html',
    styleUrls: ['./intensity-bar.component.scss']
})
export class IntensityBarComponent {

    @Input()
    set confusionMatrix(cm: ConfusionMatrix) {
        this._confusionMatrix = cm;
        this.intensityBarService.updateIntensityValues(cm);
    }

    get confusionMatrix(): ConfusionMatrix {
        return this._confusionMatrix;
    }


    @Input()
    intensityHeight = 0;

    /**
         * Allows to define the numbers display format.
         * If follows the angular decimal pipes rules: 
         * https://angular.io/api/common/DecimalPipe
         */
    @Input()
    roundRules = '1.0-2';

    /**
     * Sets the confusion matrix color level (a.k.a color intensity).
     * Should be order asc from less intense (close to 0) to max intense (close to max value).
     */
    @Input()
    set levelsColors(levelsColors: Array<string>) {
        this.intensityBarService.setLevelColors(levelsColors);
        this.intensityBarService.updateIntensityValues(this.confusionMatrix);
    }

    get levelsColors(): Array<string> {
        return this.intensityBarService.levelsColors;
    }

    @Output()
    levelsColorChange = new EventEmitter<Array<string>>();

    showConfigurations = false;

    _confusionMatrix = new ConfusionMatrix();

    constructor(private intensityBarService: IntensityBarService,
        private decimalPipe: DecimalPipe,
        private dialogService: DialogService,
        private utilService: UtilService) {
    }

    /**
        * Gets the background color for the intensity bar.
        * @returns The background color style.
        */
    getGradientBackground(): { [key: string]: string } {
        const style = {
            'background': `linear-gradient(${this.intensityBarService.levelsColors})`
        };
        return style;
    }

    /**
     * Gets the insensitive number for a given position of the intensity bar. 
     * @param index 
     * @returns 
     */
    getIntensityNumber(index: number): string {

        if (index === 0) {
            return '0';
        } else {
            const levelsStep = this.intensityBarService.levelsStep;
            if (this.levelsColors.length > levelsStep * this.levelsColors.length) {
                return this.decimalPipe.transform((index + 1) * levelsStep, this.roundRules) ?? '0';
            } else {
                return String(Math.round((index + 1) * levelsStep));
            }

        }
    }

    click() {
        const configuration = this.utilService.getComponentReference<IntensityBarConfigurationComponent>(IntensityBarConfigurationComponent);
        configuration.instance.colors = this.levelsColors;
        configuration.instance.colorsChange.subscribe((colors: Array<string>) => {
            this.levelsColors = colors;
            this.levelsColorChange.emit(colors);
        });
        this.dialogService.show(configuration);
    }

}