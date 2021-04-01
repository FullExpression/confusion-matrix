import { Component, Input } from "@angular/core";
import { StatisticStyleConfiguration } from "./statistic.model";

@Component({
    selector: 'statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent {
    @Input() title = '';

    @Input() value = 0;

    @Input() round?: string;

    @Input() labels = new Array<string>();

    @Input()
    style = new StatisticStyleConfiguration()

    getBorderRadiusStyle(): string {
        switch (this.style.border) {
            case 'Round': return '1000000px';
            case 'SlightRound': return '5px';
            case 'Square': return '0px';
        }
        return '0px';
    }
}