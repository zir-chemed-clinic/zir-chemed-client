import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { TreatmentsDTO } from '../models/TreatmentsDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {
  getAll():Observable<TreatmentsDTO[]>{
    return this._http.get<TreatmentsDTO[]>('/api/Treatments');

  }



  constructor(private _http:HttpClient) { }
}
