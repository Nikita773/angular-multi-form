import { ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'

import { ValidationMessageDirective } from '../../shared/directives/validation-message.directive'
import { Country } from '../../shared/enum/country'
import { FormModel } from '../../shared/interface/form.model'

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss'],
  standalone: true,
  imports: [ValidationMessageDirective, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCardComponent {
  public readonly form: InputSignal<FormGroup<FormModel>> = input.required<FormGroup<FormModel>>()
  public readonly readonly: InputSignal<boolean> = input<boolean>(false)
  protected readonly remove: OutputEmitterRef<void> = output<void>()

  protected suggestions: string[] = []
  protected today: string = new Date().toISOString().split('T')[0]

  protected get usernamePending(): boolean {
    return !!this.form().get('username')?.pending
  }

  protected onCountryInput(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value
    this.suggestions = Object.values(Country)
      .filter((country: string) => country.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5)
  }

  protected selectCountry(val: string): void {
    this.form().get('country')?.setValue(val)
    this.suggestions = []
  }
}
