import { Component, EventEmitter, Input } from "@angular/core";
import { IntensityBarService } from "../intensity-bar.service";
@Component({
    selector: 'intensity-bar-configuration',
    templateUrl: 'intensity-bar-configuration.component.html',
    styleUrls: ['./intensity-bar-configuration.component.scss']
})
export class IntensityBarConfigurationComponent {
    @Input()
    colors = new Array<string>()

    @Input()
    colorsChange = new EventEmitter<Array<string>>();

    constructor(private intensityBarService: IntensityBarService) {

    }

    getIntensityNumber(index: number): number {
        return this.intensityBarService.getIntensityNumber(index);
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

    remove(index: number) {
        this.colors.splice(index, 1);
        this.colorsChange.emit(this.colors);
    }

    add(index: number) {
        this.colors.splice(index, 0, this.colors[index]);
        this.colorsChange.emit(this.colors);
    }
}