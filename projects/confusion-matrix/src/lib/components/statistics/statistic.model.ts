export class StatisticStyleConfiguration {
    fontColor?= 'inherit';
    backgroundColor?= 'transparent';
    minWidth?= 'auto';
    maxWidth?= 'auto';
    border?: 'SlightRound' | 'Round' | 'Square' = 'Square'
    constructor(style?: StatisticStyleConfiguration) {
        if (style) {
            this.fontColor = style.fontColor;
            this.backgroundColor = style.backgroundColor;
            this.minWidth = style.minWidth;
            this.maxWidth = style.maxWidth;
            this.border = style.border;
        }

    }
}