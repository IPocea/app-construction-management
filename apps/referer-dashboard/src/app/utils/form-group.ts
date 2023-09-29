import { FormGroup } from '@angular/forms';

export function cleanForm(formGroup: FormGroup): void {
  Object.keys(formGroup.controls).forEach((key) => {
    if (
      formGroup.get(key).value &&
      typeof formGroup.get(key).value === 'string'
    ) {
      return formGroup.get(key).setValue(formGroup.get(key).value?.trim());
    }
  });
}
export function getPasswordToolTip(): string {
  return 'The password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.';
}
