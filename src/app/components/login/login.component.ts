import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  roles = ['Admin', 'Guest'];

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthenticationService,
    private _router: Router) { }

  ngOnInit() {
    this._authService.logout();

    this.loginForm = this._formBuilder.group({
      username: [''],
      password: [''],
      role: ['Guest']
    });

    // adding validators only when selected user role is Admin
    this.loginForm.get('role').valueChanges
      .subscribe(selectedRole => {
        const username = this.loginForm.get('username');
        const password = this.loginForm.get('password');

        if (selectedRole === 'Admin') {
          username.setValidators(Validators.required);
          password.setValidators(Validators.required);
        } else {
          username.clearValidators();
          password.clearValidators();
        }
        username.updateValueAndValidity();
        password.updateValueAndValidity();
      });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login(): void {
    // routing guard checks -> based on role dropdown
    this._authService.login();
    this._authService.grantUserAccess(this.loginForm.value); // check user type acc to entered form values
    console.log('userType? ', this._authService.getUserType());
  }

  resetData(): void {
    this.loginForm.patchValue({
      username: '',
      password: '',
      role: 'Guest'
    });
  }

  adminLogin() {
    this.loginForm.patchValue({
      username: 'admin',
      password: 'admin',
      role: 'Admin'
    });
    this.login();
  }

  getErrorMsg(errors: any): any {
    if (errors) {
      return errors.required ? 'This field is required!' : '';
    }
  }
}
