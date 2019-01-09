import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  adminObj: any;
  loggedIn = false;

  constructor(private _router: Router) {
    this.adminObj = {
      'username': 'admin',
      'password': 'admin',
      'role': 'Admin',
      'loggedIn': false
    };
  }

  login(): void {
    localStorage.clear();
    localStorage.setItem('authObj', JSON.stringify(this.adminObj));
  }

  logout(): void {
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  // isLoggedIn(): any {
  //   if (localStorage.getItem('authObj')) {
  //     return JSON.parse(localStorage.getItem('authObj')).loggedIn;
  //   }
  // }

  checkAuthenticity(userObj: any): void {
    const authObj = JSON.parse(localStorage.getItem('authObj'));

    if (authObj.username === userObj.username &&
        authObj.password === userObj.password &&
        authObj.role === userObj.role) {
      // this.adminObj.loggedIn = true;
      // this.login();
      // localStorage.setItem('authObj', JSON.stringify(this.adminObj));
      // console.log(this.adminObj);
      this.loggedIn = true;
      this._router.navigate(['/home']);
    }
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }
}
