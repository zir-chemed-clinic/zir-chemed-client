import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router) { }
  toClinicVisits(){
    this._router.navigate(["main/summonsClinicVisits"]);
  }
  toPrsonse(){
    this._router.navigate(["main/allPersons"]);
  }
  toEmploees(){
    this._router.navigate(["main/allEmployees"]);
  }
  
  ngOnInit() {
  }

}
