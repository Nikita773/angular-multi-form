import { DestroyRef, Directive, ElementRef, inject, input, InputSignal, OnInit, Renderer2 } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NgControl } from '@angular/forms'

@Directive({
  standalone: true,
  selector: '[appValidationMessage]',
})
export class ValidationMessageDirective implements OnInit {
  private readonly el: ElementRef = inject(ElementRef)
  private readonly control: NgControl = inject(NgControl)
  private readonly renderer: Renderer2 = inject(Renderer2)
  private readonly destroyRef: DestroyRef = inject(DestroyRef)

  public readonly fieldName: InputSignal<string> = input('', { alias: 'appValidationMessage' })

  public ngOnInit(): void {
    this.control.statusChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.showError())
  }

  private showError(): void {
    const parent = this.el.nativeElement.parentElement
    let error = parent.querySelector('.validation-message')
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      this.renderer.addClass(this.el.nativeElement, 'is-invalid')
      if (!error) {
        error = this.renderer.createElement('div')
        this.renderer.addClass(error, 'text-danger')
        this.renderer.addClass(error, 'validation-message')
        this.renderer.appendChild(parent, error)
      }
      this.renderer.setProperty(error, 'textContent', `Please provide a correct ${this.fieldName()}`)
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'is-invalid')
      if (error) {
        this.renderer.removeChild(parent, error)
      }
    }
  }
}
