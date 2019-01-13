import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  @Input() errorType: string;

  isLoggedIn = false;

  constructor(
    private _authService: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this._authService.getUserType() ? true : false;

    if (!this.errorType && this.isLoggedIn) {
      this.errorType = 'no-selection';
    } else if (!this.errorType && !this.isLoggedIn) {
      this.errorType = 'dev-details';
    }

    // console.log('errrrrrrorrrrrrrorrrrr-----', this.errorType, this.isLoggedIn);
  }

  navigateTo(route: string): void {
    this._router.navigate([route]);
  }
}
