import { AbstractControl } from "@angular/forms";

export interface ControlsMap<T extends AbstractControl> {
    [key: string]: T;
}
