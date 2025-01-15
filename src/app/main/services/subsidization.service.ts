import { Injectable } from '@angular/core';
import { SubsidizationDTO } from '../models/SubsidizationDTO';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubsidizationService {
  saveSubsidization(SubsidizationToSave: SubsidizationDTO):Observable<SubsidizationDTO>{
   return this._http.post<SubsidizationDTO>("/api/Subsidization",SubsidizationToSave);
  }

  constructor(private _http:HttpClient) { }
}
