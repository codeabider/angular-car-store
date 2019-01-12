import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/interface/car';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  adminObj: Auth;
  userType = '';
  private logger = new Subject<string>();

  constructor(private _router: Router) {
    this.adminObj = {
      'username': 'admin',
      'password': 'admin',
      'role': 'Admin'
    };
  }

  setCredentials(itemKey: string, itemVal: string): void {
    localStorage.setItem(itemKey, itemVal);
  }

  getCredentials(itemKey: string): string {
    return localStorage.getItem(itemKey);
  }

  clearCredentialsStorage() {
    localStorage.clear();
  }

  // return user login state as observable
  isLoggedIn(): Observable<string> {
    return this.logger.asObservable();
  }

  login() {
    // localStorage.setItem('authParams', providerResponse);
    this.setCredentials('authObj', JSON.stringify(this.adminObj));
    // this.logger.next(this.userType);
  }

  logout() {
    // localStorage.removeItem('authParams');
    this.userType = '';
    this.clearCredentialsStorage();
    this.logger.next(this.userType);
  }

  // checks whether user is guest or admin
  grantUserAccess(userObj: Auth): void {
    const authObj: Auth = JSON.parse(this.getCredentials('authObj'));
    console.log('auth srvc: ', userObj);
    if ((authObj.username === userObj.username &&
        authObj.password === userObj.password &&
        authObj.role === userObj.role) ||
        this.getCredentials('userType') === 'admin') {
      this.userType = 'admin';
    } else {
      this.userType = 'guest';
    }
    this.setCredentials('userType', this.userType);
    this.logger.next(this.userType); // notify subs of userType change/ init

    this._router.navigate(['/home']);
  }

  // checks type of logged in user
  getUserType(): string {
    console.log('auth srvc userType from local var/ local storage: ', this.userType, this.getCredentials('userType'));
    return this.userType || this.getCredentials('userType');
  }
}
