import { Component, Input } from "@angular/core";

@Component({
    selector: 'home-page-line',
    templateUrl: './line-home-page.component.html',
    styleUrls: ['./line-home-page.component.scss']
})
export class HomePageLineComponent {
    @Input()
    icon: string | undefined;

    @Input()
    topDescription: string | undefined;

    @Input()
    title: string | undefined;

    @Input()
    downDescription: string | undefined;

    @Input()
    gifLocation: string | undefined;

    @Input()
    rightToLeft = false;

    @Input()
    backgroundColor = '#ffd384';

    @Input()
    videoLocation: string | undefined;

}