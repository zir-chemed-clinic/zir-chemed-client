import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  {path:"" , pathMatch: "full",redirectTo:"auth"},
  {path: 'auth',loadChildren: './auth/auth.module#AuthModule'},
  {path: 'main',loadChildren: './main/main.module#MainModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
