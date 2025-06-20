import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form } from '../models/Form';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
    saveSignature(from: { id: number; fromWhom: string; signature: string }): Observable<boolean> {
        return this._http.post<boolean>('/api/Picture/', from);
      }
     
      showSignature(from: {id: number; fromWhom: string}): Observable<string> {
        const params = new HttpParams()
          .set('id', from.id.toString())
          .set('fromWhom', from.fromWhom);
      console.log("service");
      
        return this._http.get('/api/Picture', { params, responseType: 'text'  });
      }
    
    

  constructor(private _http:HttpClient) { }
}