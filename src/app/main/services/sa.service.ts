import { Injectable } from '@angular/core';
import { SaDTO } from '../models/SaDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Form } from '../models/Form';

@Injectable({
  providedIn: 'root'
})
export class SaService {
  getByClinicVisitId(ClinicVisitsId: number):Observable<SaDTO> {
    return this._http.get<SaDTO>("/api/Sa/"+ClinicVisitsId);
  }
  saveSa(saToSave: SaDTO):Observable<SaDTO> {
   return this._http.post<SaDTO>("/api/Sa/",saToSave)
  }
  saveSaPdf(saPdf:any,id:number):Observable<void>{
    return this._http.post<void>("/api/Sa/",saPdf)
  }
  saveSaP(saPdf:Form,id:number):Observable<File>{
    return this._http.post<File>("/api/Sa/2",saPdf)
  }
 

  constructor(private _http:HttpClient) { }
}
