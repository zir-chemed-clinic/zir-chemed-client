import { Injectable } from '@angular/core';
import { EmployeesDTO } from '../models/EmployeesDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  getById(doctor: number) :Observable<EmployeesDTO> {
    return this._http.get<EmployeesDTO>("/api/Employees/"+doctor);
  }
  saveEmployees(EmployeesToSave:EmployeesDTO):Observable<EmployeesDTO> {
    return this._http.post<EmployeesDTO>("/api/Employees",EmployeesToSave);
  }
  getAll():Observable<EmployeesDTO[]>  {
    return this._http.get<EmployeesDTO[]>("/api/Employees");
  }

  constructor(private _http:HttpClient) { }
}
