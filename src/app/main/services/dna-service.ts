import { Observable } from "rxjs";
import { DnaDTO } from "../models/DnaDTO";
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DnaService {
 getByClinicVisitId(ClinicVisitsId: number):Observable<DnaDTO> {
    return this._http.get<DnaDTO>("/api/Dna/"+ClinicVisitsId);
  }
    saveDna(dnaToSave: DnaDTO):Observable<DnaDTO> {     
     return this._http.post<DnaDTO>("/api/Dna/",dnaToSave)
    }
    constructor(private _http:HttpClient) { }

}