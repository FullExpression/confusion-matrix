import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from "@angular/core";
import { UtilService } from "../../services/util.service";
import { DialogComponent } from "./dialog.component";

@Injectable()
export class DialogService {

    private dialogReference: ComponentRef<DialogComponent> | undefined;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
        private applicationRef: ApplicationRef,
        private injector: Injector,
        private utilService: UtilService) { }

    show(componentRef: ComponentRef<any>) {

        const dialogRef = this.getDialogComponent();

        this.applicationRef.attachView(dialogRef.hostView);
        this.applicationRef.attachView(componentRef.hostView);
        dialogRef.changeDetectorRef.detectChanges();
        componentRef.changeDetectorRef.detectChanges();
        const dialogContent = dialogRef.instance.content?.nativeElement as HTMLElement

        const componentElement = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;
        dialogContent.appendChild(componentElement);

        const domElem = (dialogRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        document.body.appendChild(domElem);

        return componentRef;
    }

    hide() {
        this.dialogReference?.instance.changeVisibility(false);
    }

    private getDialogComponent(): ComponentRef<DialogComponent> {
        return this.utilService.getComponentReference(DialogComponent);
    }
}