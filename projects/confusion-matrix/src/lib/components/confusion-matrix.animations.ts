import { animate, style, transition, trigger } from "@angular/animations";

export const confusionMatrixAnimations = [[
    trigger(
        'inOutAnimation',
        [
            transition(
                ':enter',
                [
                    style({
                        opacity: 0, marginTop: '-20px'
                    }),
                    animate('0.3s ease',
                        style({ opacity: 1, marginTop: 0 }))
                ]
            ),
            transition(
                ':leave',
                [
                    style({ opacity: 1, marginTop: 0 }),
                    animate('0.3s ease',
                        style({ opacity: 0, marginTop: '-20px' }))
                ]
            )
        ]
    ),
    trigger(
        'outAnimation',
        [
            transition(
                ':leave',
                [
                    style({ opacity: 1 }),
                    animate('0.15s ease',
                        style({ opacity: 0 }))
                ]
            )
        ]
    ),
    trigger(
        'removeAddLine',
        [
            transition(
                ':leave',
                [
                    style({ opacity: 1, marginTop: 0 }),
                    animate('0.4s ease',
                        style({ opacity: 0, marginTop: '-40px' }))
                ]
            ),
            transition(
                ':enter',
                [
                    style({ opacity: 0, marginTop: '-40px' }),
                    animate('0.4s ease',
                        style({ opacity: 1, marginTop: 0 }))
                ]
            )
        ]
    ),
    trigger(
        'removeAddColumns',
        [
            transition(
                ':leave',
                [
                    style({ opacity: 1 }),
                    animate('0.4s ease',
                        style({ opacity: 0, marginLeft: '-40px', height: 0 }))
                ]
            ),
            transition(
                ':enter',
                [
                    style({ opacity: 0, marginLeft: '-40px' }),
                    animate('0.4s ease',
                        style({ opacity: 1, marginLeft: '0px' }))
                ]
            )
        ]
    ),
    trigger(
        'rowsAddDeleteAnimation',
        [
            transition(
                ':enter',
                [
                    style({ opacity: 0, marginRight: '-24px' }),
                    animate('0.4s ease',
                        style({ opacity: 1, marginRight: 0 }))
                ]
            ),
            transition(
                ':leave',
                [
                    style({ opacity: 1, marginRight: 0 }),
                    animate('0.4s ease',
                        style({ opacity: 0, marginRight: '-24px' }))
                ]
            )
        ]
    ),
    trigger(
        'columnsAddDeleteAnimation',
        [
            transition(
                ':enter',
                [
                    style({ opacity: 0, marginTop: '-19px' }),
                    animate('0.3s ease',
                        style({ opacity: 1, marginTop: 0 }))
                ]
            ),
            transition(
                ':leave',
                [
                    style({ opacity: 1, marginTop: 0 }),
                    animate('0.3s ease',
                        style({ opacity: 0, marginTop: '-19px' }))
                ]
            )
        ]
    ),
]]