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
  roles: string[] = ['Guest', 'Admin'];

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthenticationService,
    private _router: Router) { }

  ngOnInit() {
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

  login() {
    // console.log('login details: ', this.loginForm.value);
    // routing guard checks -> based on role dropdown
    this._authService.login();
    this._authService.checkAuthenticity(this.loginForm.value);
    // console.log('isAdmin? ', this._authService.checkAuthenticity(this.loginForm.value));
    // if (this._authService.checkAuthenticity(this.loginForm.value)) {
    //   this._router.navigate(['/home']);
    // }
  }

  resetData() {
    this.loginForm.patchValue({
      username: '',
      password: '',
      role: 'Guest'
    });
  }

  getErrorMsg(errors: any) {
    if (errors) {
      return errors.required ? 'This field is required!' : '';
    }
  }
}
