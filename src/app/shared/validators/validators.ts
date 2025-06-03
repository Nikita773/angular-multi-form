import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms'
import { Observable, of, timer } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'

import { UserService } from '../services/user.service'

export function noFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null
    }
    return new Date(control.value) > new Date() ? { futureDate: true } : null
  }
}

export function validCountryValidator(allowedCountries: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null
    }
    return allowedCountries.includes(control.value) ? null : { invalidCountry: true }
  }
}

export function usernameAvailableValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null)
    }
    return timer(300).pipe(
      switchMap(() => userService.checkUsername(control.value)),
      map(({ isAvailable }) => (isAvailable ? null : { notAvailable: true })),
      catchError(() => of(null)),
    )
  }
}
