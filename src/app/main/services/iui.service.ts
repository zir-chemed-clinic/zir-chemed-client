import { Injectable } from '@angular/core';
import { IuiDTO } from '../models/IuiDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IuiService {
  getByClinicVisitId(ClinicVisitsId: number):Observable<IuiDTO> {
    return this._http.get<IuiDTO>("/api/Iui/"+ClinicVisitsId);
  }
  saveIui(iuiToSave:IuiDTO):Observable<IuiDTO> {
    return this._http.post<IuiDTO>("/api/Iui",iuiToSave);
  }

  constructor(private _http:HttpClient) { }
}
