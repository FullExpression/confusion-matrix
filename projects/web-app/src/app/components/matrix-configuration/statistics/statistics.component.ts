import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AverageMethod, ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";
import { StatisticStyleConfiguration } from "projects/confusion-matrix/src/public-api";

@Component({
    selector: 'statistics',
    styleUrls: ['./statistics.component.scss'],
    templateUrl: './statistics.component.html'
})
export class StatisticsComponent {

    @Input()
    confusionMatrix = new ConfusionMatrix();

    @Output()
    confusionMatrixChange = new EventEmitter<ConfusionMatrix>();

    statisticStyleStrong = new StatisticStyleConfiguration({
        fontColor: '#fff',
        backgroundColor: 'rgb(231 76 60)'
    });

    statisticStyleGray = new StatisticStyleConfiguration({
        fontColor: '#fff',
        backgroundColor: 'rgb(156 156 156)',
        border: 'SlightRound'
    });

    statisticStyleRound = new StatisticStyleConfiguration({
        fontColor: '#677277',
        backgroundColor: 'rgb(255 222 85)',
        border: 'Round'
    });

    getPrecisionForHappiness(): number {
        return this.confusionMatrix.precision({
            average: AverageMethod.Weighted,
            label: 'Happiness'
        });
    }

    getMacroF1Score(): number {
        return this.confusionMatrix.f1Score({
            average: AverageMethod.Macro,
            label: 'Happiness'
        });
    }

    getNumberOfPredictions(): number {
        return this.confusionMatrix.getNumberOfPredictions();
    }
}