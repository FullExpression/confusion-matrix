import { AverageMethod } from "@fullexpression/confusion-matrix-stats";

export interface MetricsConfiguration {
    metric: MetricsEnum,
    averageMethod: AverageMethod;
}

export enum MetricsEnum {
    Accuracy = 'Accuracy',
    MissClassificationRate = 'Miss Classification Rate',
    Precision = 'Precision',
    Recall = 'Recall',
    Specificity = 'Specificity',
    F1Score = 'F1Score'
}