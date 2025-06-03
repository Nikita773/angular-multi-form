import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { interval, takeWhile, tap } from 'rxjs'

import { MAX_FORMS, SUBMIT_TIMER_SECONDS } from '../../shared/consts/consts'
import { Country } from '../../shared/enum/country'
import { FormModel } from '../../shared/interface/form.model'
import { UsernameService } from '../../shared/services/username.service'
import {
  noFutureDateValidator,
  usernameAvailableValidator,
  validCountryValidator,
} from '../../shared/validators/validators'
import { FormCardComponent } from '../form-card/form-card.component'

function createForm(usernameService: UsernameService): FormGroup<FormModel> {
  return new FormGroup<FormModel>({
    country: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validCountryValidator(Object.values(Country))],
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
      asyncValidators: [usernameAvailableValidator(usernameService)],
    }),
    birthday: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, noFutureDateValidator()],
    }),
  })
}

@Component({
  selector: 'app-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.scss'],
  imports: [FormCardComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormArrayComponent {
  private readonly usernameService: UsernameService = inject(UsernameService)
  private readonly destroyRef: DestroyRef = inject(DestroyRef)

  protected readonly submitting: WritableSignal<boolean> = signal(false)
  protected readonly forms: WritableSignal<FormGroup<FormModel>[]> = signal([createForm(this.usernameService)])
  protected readonly timer: WritableSignal<number> = signal(0)
  private submissionCanceled = false

  protected get invalidFormsCount(): number {
    return this.forms().filter((form: FormGroup<FormModel>) => form.invalid).length
  }

  protected addForm(): void {
    if (this.forms().length < MAX_FORMS) {
      this.forms.set([...this.forms(), createForm(this.usernameService)])
    }
  }

  protected removeForm(index: number): void {
    if (this.forms().length === 1) {
      return
    }
    this.forms.set(this.forms().filter((_: FormGroup<FormModel>, i: number) => i !== index))
  }

  protected onSubmitOrCancel(): void {
    if (this.submitting()) {
      this.cancelSubmission()
    } else {
      this.submitAllForms()
    }
  }

  private submitAllForms(): void {
    if (this.invalidFormsCount > 0) {
      return
    }
    this.submitting.set(true)
    this.timer.set(SUBMIT_TIMER_SECONDS)

    this.submissionCanceled = false
    interval(1000)
      .pipe(
        tap(() => this.timer.set(this.timer() - 1)),
        takeWhile(() => this.timer() > 0 && !this.submissionCanceled),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        complete: () => {
          if (this.timer() === 0 && !this.submissionCanceled) {
            this.finalizeSubmission()
          }
        },
      })
  }

  private cancelSubmission(): void {
    this.submissionCanceled = true
    this.submitting.set(false)
    this.timer.set(0)
  }

  private finalizeSubmission(): void {
    this.forms.set([createForm(this.usernameService)])
    this.submitting.set(false)
    this.timer.set(0)
  }
}
