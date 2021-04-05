import { Injectable } from "@angular/core";

@Injectable()
export class UtilService {
    /**
    * Deep copies a given object.
    * @param object The object to be deep copied.
    * @returns The deep copied object.
    */
    deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }
}