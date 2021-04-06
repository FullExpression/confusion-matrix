export class MetricStyleConfiguration {
    fontColor?= 'inherit';
    backgroundColor?= 'transparent';
    minWidth?= 'auto';
    maxWidth?= 'auto';
    border: 'SlightRound' | 'Round' | 'Square' = 'Round';
    constructor(style?: MetricStyleConfiguration) {
        if (style) {
            this.fontColor = style.fontColor;
            this.backgroundColor = style.backgroundColor;
            this.minWidth = style.minWidth;
            this.maxWidth = style.maxWidth;
            this.border = style.border;
        }

    }
}


export class MetricTag {
    text?= 'Untitled';
    fontColor?= 'inherit';
    backgroundColor?= 'transparent';
    constructor(metricLabel?: MetricTag) {
        if (metricLabel) {
            this.text = metricLabel.text;
            this.fontColor = metricLabel.fontColor;
            this.backgroundColor = metricLabel.backgroundColor;
        }
    }
}