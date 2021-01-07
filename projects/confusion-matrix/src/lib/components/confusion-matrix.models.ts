export enum ConfusionMatrixSizes {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    ExtraLarge = 'extra-large'
}

export interface ConfusionMatrix {
    labels: Array<string>;
    matrix: Array<Array<number>>;
}