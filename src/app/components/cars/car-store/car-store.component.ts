import { Component, OnInit } from '@angular/core';
import { CarListService } from '../../../shared/services/car-list.service';
import { Car } from '../../../interface/car';
import { MatDialog } from '@angular/material';
import { OperationDialogComponent } from '../operation-dialog/operation-dialog.component';

@Component({
  selector: 'app-car-store',
  templateUrl: './car-store.component.html',
  styleUrls: ['./car-store.component.scss']
})
export class CarStoreComponent implements OnInit {
  carsList: Car[];

  constructor(
    private _carsService: CarListService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.carsList = this._carsService.getCars();
  }

  // add new car
  openCarAddDialog(): void {
    const dialogRef = this.dialog.open(OperationDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: Car) => {
      if (result) {
        this.carsList.push(result);
        // this._carsService.postCar(result);
      }
    });
  }

  // remove a car
  onCarRemove(carToRemoveObj: any): void {
    this.carsList.splice(carToRemoveObj.index, 1);
    console.log('removed: ', carToRemoveObj);
  }

  // edit existing car
  onCarDetailsEdit(carToEditObj: any): void {
    this.carsList[carToEditObj.index] = carToEditObj.car;
    // this._carsService.postCar(this.carsList[carToEditObj.index]);
    console.log('editted: ', carToEditObj);
  }
}
