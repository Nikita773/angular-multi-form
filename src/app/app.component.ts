import { ChangeDetectionStrategy, Component } from '@angular/core'

import { FormArrayComponent } from './components/form-array/form-array.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [FormArrayComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
