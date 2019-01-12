import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userType: string;

  constructor(private _authService: AuthenticationService) { }

  ngOnInit() {
    // console.log('nav init');

    // local storage retrieval way
    this.userType =  this._authService.getUserType();
    this.isLoggedIn = this.userType ? true : false;

    // observable return retrieval way
    this._authService.isLoggedIn().subscribe(userType => {
      this.userType = userType || this._authService.getUserType();
      this.isLoggedIn = this.userType ? true : false;
      // console.log('nav login observ: ', this.isLoggedIn);
    });
  }

  logout() {
    this._authService.logout();
    console.log('logged out! adios...');
  }
}
