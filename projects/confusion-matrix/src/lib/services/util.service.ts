import { ComponentFactoryResolver, ComponentRef, Injectable, Injector } from "@angular/core";

@Injectable()
export class UtilService {

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector) {

    }

    /**
    * Deep copies a given object.
    * @param object The object to be deep copied.
    * @returns The deep copied object.
    */
    deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }

    getComponentReference<T>(component: any): ComponentRef<T> {
        return this.componentFactoryResolver.resolveComponentFactory(component)
            .create(this.injector) as ComponentRef<T>;
    }
}