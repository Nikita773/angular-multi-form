import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { FormValueModel } from '../interface/form.model'
import { SubmitFormResponseData } from '../interface/responses'

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  public checkUsername(username: string): Observable<{ isAvailable: boolean }> {
    return this.http.post<{ isAvailable: boolean }>('/api/checkUsername', { username })
  }

  public submitForms(forms: FormValueModel[]): Observable<SubmitFormResponseData> {
    return this.http.post<SubmitFormResponseData>('/api/submitForm', forms)
  }
}
