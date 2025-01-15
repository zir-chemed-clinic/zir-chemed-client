import { Injectable } from '@angular/core';
import { PctDTO } from '../models/PctDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PctService {
  getByClinicVisitId(ClinicVisitsId: number):Observable<PctDTO> {
    return this._http.get<PctDTO>("/api/Pct/"+ClinicVisitsId);
   
  }
  savePct(pctToSave: PctDTO):Observable<PctDTO> {
    return this._http.post<PctDTO>("/api/Pct",pctToSave)
  }

  constructor(private _http:HttpClient ) { }
}
