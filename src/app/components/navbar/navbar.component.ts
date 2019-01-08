import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // isLoggedIn = false;

  constructor(private _authService: AuthenticationService) { }

  ngOnInit() {
    // this.isLoggedIn = this._authService.isLoggedIn();
  }
}
