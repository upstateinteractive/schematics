import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { LoginPageComponent } from './containers/login-page/login-page.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {
  MatSidenavModule,
  MatCardModule,
  MatButtonModule,
} from '@angular/material';
import { RegisterComponent } from './components/register/register.component';
import { RegisterPageComponent } from './containers/register-page/register-page.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  declarations: [LoginComponent, LoginPageComponent, RegisterComponent, RegisterPageComponent]
})
export class AuthModule { }
