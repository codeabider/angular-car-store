import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  isLoggedIn = false;

  constructor(private _authService: AuthenticationService) { }

  ngOnInit() {
    this.isLoggedIn = this._authService.getUserType() ? true : false;
  }

}
