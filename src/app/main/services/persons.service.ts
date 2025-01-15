import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonsDTO } from '../models/PersonsDTO';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  getById(PersonsId: number):Observable<PersonsDTO> {
    return this._http.get<PersonsDTO>("/api/Persons/"+PersonsId);
  }
  constructor(private _http:HttpClient) { }
  savePersons(personsToSave: PersonsDTO):Observable<PersonsDTO> {
    return this._http.post<PersonsDTO>("/api/Persons",personsToSave);
  }
  getAll():Observable<PersonsDTO[]>  {
    return this._http.get<PersonsDTO[]>("/api/Persons");
  }
}
