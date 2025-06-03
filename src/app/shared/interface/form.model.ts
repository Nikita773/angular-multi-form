import { FormControl } from '@angular/forms'

export interface FormModel {
  country: FormControl<string>
  username: FormControl<string>
  birthday: FormControl<string>
}

export interface FormValueModel {
  country: string
  username: string
  birthday: string
}
