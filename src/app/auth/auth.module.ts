import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { UserService } from './services/user.service';
import { RouterModule } from '@angular/router';
import {  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import { UserComponent } from './user/user.component';
import { AllUsersComponent } from './all-users/all-users.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
@NgModule({
  declarations: [LoginComponent, UserComponent, AllUsersComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    RouterModule.forChild([
      {path:"" , pathMatch: "full",redirectTo:"login"},
      {path:"login",component:LoginComponent},
      {path:"user",component:UserComponent},
      {path:"user/:userId",component:UserComponent},
      {path:"allUsers",component:AllUsersComponent}
    
    ])
  ],
  providers:[UserService]
})
export class AuthModule { }
