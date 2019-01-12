import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Car, TheCar } from '../../../interface/car';
import { MatDialog } from '@angular/material';
import { OperationDialogComponent } from '../operation-dialog/operation-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CarListService } from '../../../shared/services/car-list.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss']
})
export class CarDetailsComponent implements OnInit {
  @Input() car: Car;
  @Input() uniqueSpecs: any[];

  @Output() removed = new EventEmitter<Car>();
  @Output() detailsEdit = new EventEmitter<Car>();

  isRouted = false;
  isDataLoaded = false;

  constructor(
    public dialog: MatDialog,
    private _router: Router,
    private _route: ActivatedRoute,
    private _carsService: CarListService) { }

  ngOnInit() {
    // check from URL, whether the component is routed or part of parent
    // if its part of parent, no service call - else make service call
    this.checkRouted();
  }

  checkRouted(): void {
    let carFullName: string;
    if (this._route.snapshot.paramMap.get('carFullName')) {
      carFullName = this._route.snapshot.paramMap.get('carFullName').replace('%20', ' ');
      console.log(carFullName);
      this.isRouted = true; // unutilized as of now - use in navigating home w/o service call
      this._carsService.getJSON().subscribe((data: TheCar) => {
        const mappedCarsObj = this._carsService.getMappedObj(data);
        const regex = new RegExp(carFullName, 'ig');
        console.log(mappedCarsObj);
        mappedCarsObj.filter((car: Car) => {
          if ((`${car.brand} ${car.model}`).match(regex)) {
            this.car = car;
          }
        });
        this.isDataLoaded = true;
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
