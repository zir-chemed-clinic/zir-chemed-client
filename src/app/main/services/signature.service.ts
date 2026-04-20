import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form } from '../models/Form';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
    // saveSignature(from: { id: number; fromWhom: string; signature: string }): Observable<boolean> {
    //     return this._http.post<boolean>('/api/Picture/', from);
    //   }
     saveSignature(from: { clinicVisitId: number; signatureType: string; signatureDataBase64: string  }): Observable<boolean> {
        return this._http.post<boolean>('/api/Signatures/', from);
      }
     
      showSignature(from: {clinicVisitId: number; signatureType: string}): Observable<string> {
        const params = new HttpParams()
          .set('clinicVisitId', from.clinicVisitId.toString())
          .set('signatureType', from.signatureType);
      console.log("service");
      
        return this._http.get('/api/Signatures', { params, responseType: 'text'  });
      }
    
    

  constructor(private _http:HttpClient) { }
}