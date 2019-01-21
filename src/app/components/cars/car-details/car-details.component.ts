import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Car, Config, CarSpecs } from '../../../interface/car';
import { MatDialog } from '@angular/material';
import { OperationDialogComponent } from '../operation-dialog/operation-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CarListService } from '../../../shared/services/car-list.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarDetailsComponent implements OnInit {
  @Input() car: Car;
  @Input() uniqueSpecs: CarSpecs[];
  @Input() isAdmin: boolean;

  @Output() removed = new EventEmitter<Car>();
  @Output() detailsEdit = new EventEmitter<Car>();

  // isAdmin = false;
  // isDataLoaded = false;
  isRouted = false;
  errorReturned = false;

  constructor(
    public dialog: MatDialog,
    private _router: Router,
    private _route: ActivatedRoute,
    private _carsService: CarListService,
    private _authService: AuthenticationService) { }

  ngOnInit() {
    // check from URL, whether the component is routed or part of parent
    // if its part of parent, no service call - else make service call
    this.checkRouted();
  }

  checkRouted(): void {
    let carFullName: string;
    if (this._route.snapshot.paramMap.get('carFullName')) {
      this.isAdmin = this._authService.getUserType() === 'admin' ? true : false;
      // this._authService.isLoggedIn().subscribe(isUserLoggedIn => console.log());

      carFullName = this._route.snapshot.paramMap.get('carFullName').replace('%20', ' ');
      console.log(carFullName, 'isAdmin? ', this.isAdmin);
      this.isRouted = true; // unutilized as of now - use in navigating home w/o service call

      this._carsService.getCarData().subscribe((cars: Config) => {
        const mappedCarsObj = this._carsService.getMappedObj(cars.data);
        const regex = new RegExp(`^${carFullName}$`, 'ig');
        // console.log(mappedCarsObj);
        mappedCarsObj.filter((car: Car) => {
          if ((`${car.brand} ${car.model}`).match(regex)) {
            this.car = car;
          }
        });
        if (!this.car) {
          this.errorReturned = true;
        }
        console.log('Car details: ', this.car);
        // this.isDataLoaded = true;
      }, error => {
        console.log(error);
        this.errorReturned = true;
      });
    }
  }

  openCarRemoveDialog(): void {
    const dialogRef = this.dialog.open(OperationDialogComponent, {
      width: '300px',
      data: {'remove': true}
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.removed.emit(this.car);
      }
    });
  }

  openCarEditDialog(): void {
    const dialogRef = this.dialog.open(OperationDialogComponent, {
      width: '500px',
      data: {car: this.car, uniqueSpecs: this.uniqueSpecs}
    });

    dialogRef.afterClosed().subscribe((result: Car) => {
      if (result) {
        this.detailsEdit.emit(result);
      }
    });
  }

  showCarDetails() {
    this._router.navigate(['/details', `${this.car.brand} ${this.car.model}`]);
  }

  goBack() {
    this._router.navigate(['/home']);
  }
}
