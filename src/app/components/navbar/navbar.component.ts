import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userType: string;

  constructor(
    private _authService: AuthenticationService,
    private _renderer: Renderer2) { }

  ngOnInit() {
    // console.log('nav init');
    this._renderer.addClass(document.body, 'dark');

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

  logout(): void {
    this._authService.logout();
    console.log('logged out! adios...');
  }

  changeTheme(appTheme: string): void {
    if (appTheme === 'dark') {
      this._renderer.addClass(document.body, 'dark');
    } else {
      this._renderer.removeClass(document.body, 'dark');
    }
  }
}
