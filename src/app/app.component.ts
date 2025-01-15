import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Zirchemed';
  constructor(private _router: Router) { }
  toClinicVisits(){
    this._router.navigate([ "main/summonsClinicVisits"]);
  }
  toPrsonse(){
    this._router.navigate(["main/allPersons"]);
  }
  toEmploees(){
    this._router.navigate(["main/allEmployees"]);
  }


}
