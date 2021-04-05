import { Injectable } from "@angular/core";
import { AverageMethod, ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";
import { MetricsEnum } from "../metrics.configurations.model";

@Injectable()
export class MetricService {
    calculate(confusionMatrix: ConfusionMatrix, metric: MetricsEnum, average?: AverageMethod, label?: string): number {
        switch (metric) {
            case MetricsEnum.Accuracy:
                return confusionMatrix.accuracy({ label, average });
            case MetricsEnum.F1Score:
                return confusionMatrix.f1Score({ label, average });
            case MetricsEnum.MissClassificationRate:
                return confusionMatrix.missClassificationRate({ label, average });
            case MetricsEnum.Precision:
                return confusionMatrix.precision({ label, average });
            case MetricsEnum.Recall:
                return confusionMatrix.recall({ label, average });
            case MetricsEnum.Specificity:
                return confusionMatrix.specificity({ label, average });
        }
    }

    getMetricEnum(value: string | undefined): MetricsEnum | null {
        switch (value) {
            case MetricsEnum.Accuracy:
                return MetricsEnum.Accuracy
            case MetricsEnum.F1Score:
                return MetricsEnum.F1Score
            case MetricsEnum.MissClassificationRate:
                return MetricsEnum.MissClassificationRate;
            case MetricsEnum.Precision:
                return MetricsEnum.Precision;
            case MetricsEnum.Recall:
                return MetricsEnum.Recall
            case MetricsEnum.Specificity:
                return MetricsEnum.Specificity
        }
        return null;
    }
}