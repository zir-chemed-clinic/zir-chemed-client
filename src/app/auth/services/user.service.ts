import { Injectable } from '@angular/core'
import {User} from '../models/User'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  deleteUser(userId: number) :Observable<User>{
    return this._http.delete<User>('/api/Users/'+userId);
  }
  getById(userId: number) :Observable<User>{
    return this._http.get<User>('/api/Users/'+userId);
  }
  getUser(userName:string,userPassword:string) :Observable<User>{
    return this._http.get<User>('/api/Users/'+userName+','+userPassword);
  }

  getAll():Observable<User[]>{
    return this._http.get<User[]>('/api/Users/getAQL/123456789ABCDEF');

  }
  saveUser(userToSave: User) :Observable<User>{
    return this._http.post<User>('/api/Users',userToSave);
  }
  // savePersons(personsToSave: PersonsDTO):Observable<PersonsDTO> {
  //   return this._http.post<PersonsDTO>("/api/Persons",personsToSave);
  // }
  constructor(private _http:HttpClient) { }

 
}
