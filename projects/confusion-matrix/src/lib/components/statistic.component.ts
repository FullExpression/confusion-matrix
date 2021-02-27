import { Component, Input } from "@angular/core";

@Component({
    selector: 'statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent {
    @Input() title = '';

    @Input() value = 0;
}