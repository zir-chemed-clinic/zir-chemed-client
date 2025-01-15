import { Injectable } from '@angular/core';
import { TreatmentsDTO } from '../models/TreatmentsDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class 
TreatmentService {
  getById(treatmentsId: number) :Observable<TreatmentsDTO>{
    return this._http.get<TreatmentsDTO>('/api/Treatments/'+treatmentsId);
  }

  getAll():Observable<TreatmentsDTO[]>{
    return this._http.get<TreatmentsDTO[]>('/api/Treatments');

  }
  saveTreatments(TreatmentsToSave: TreatmentsDTO) :Observable<TreatmentsDTO>{
    return this._http.post<TreatmentsDTO>('/api/Treatments',TreatmentsToSave);
  }
  // savePersons(personsToSave: PersonsDTO):Observable<PersonsDTO> {
  //   return this._http.post<PersonsDTO>("/api/Persons",personsToSave);
  // }
  constructor(private _http:HttpClient) { }
}
