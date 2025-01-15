import { Injectable } from '@angular/core';
import { InseminationDTO } from '../models/InseminationDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InseminationService {
  getByClinicVisitId(ClinicVisitsId: number):Observable<InseminationDTO> {
    return this._http.get<InseminationDTO>("/api/Insemination/"+ClinicVisitsId);
   
  }
  saveInsemination(inseminationToSave: InseminationDTO):Observable<InseminationDTO> {
    return this._http.post<InseminationDTO>("/api/Insemination",inseminationToSave);
  }

  constructor(private _http:HttpClient) { }
}
