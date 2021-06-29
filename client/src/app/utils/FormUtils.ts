import {AbstractControl} from "@angular/forms";

export class FormUtils {
  public static isFormControlInvalid(formControl: AbstractControl | null): boolean {
    if (!formControl) return false;
    return formControl.invalid && formControl.touched;
  }
}
