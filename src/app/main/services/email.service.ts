import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form } from '../models/Form';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  sendEmail(from: Form):Observable<boolean> {
    // return this._http.put<boolean>("/api​/Email​/"+email,{"file":file});
    return this._http.post<boolean>('/api/Email',from);
  }
  constructor(private _http:HttpClient) { }
}
