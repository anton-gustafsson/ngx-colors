import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ColorHelper } from '../utility/color-helper';

export function ColorValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (ColorHelper.getColorModelByString(control.value) === 'INVALID') {
      return { invalidColor: true };
    }
    return null;
  };
}
