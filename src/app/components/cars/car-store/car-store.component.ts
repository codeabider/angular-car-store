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
  filteredCarsList: Car[];

  constructor(
    private _carsService: CarListService,
    public dialog: MatDialog) {
    }

  ngOnInit() {
    this.carsList = this._carsService.getCars();
    this.filteredCarsList = this.carsList;
  }

  // add new car
  openCarAddDialog(): void {
    const dialogRef = this.dialog.open(OperationDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: Car) => {
      if (result) {
        this.carsList.push(result);
        this.filteredCarsList = [...this.carsList];
        // post change to service for each CRUD

        console.log('added: ', result);
      }
    });
  }

  // remove a car
  onCarRemove(carToRemove: Car): void {
    const carToRemoveIndex = this.carsList.map(car => car.id === carToRemove.id).indexOf(true);

    this.carsList.splice(carToRemoveIndex, 1);
    this.filteredCarsList = [...this.carsList];

    console.log('removed: ', carToRemove);
  }

  // edit existing car
  onCarDetailsEdit(carToEdit: Car): void {
    const carToEditIndex = this.carsList.map(car => car.id === carToEdit.id).indexOf(true);

    this.carsList[carToEditIndex] = carToEdit;
    this.filteredCarsList = [...this.carsList];

    console.log('editted: ', carToEdit);
  }

  onCarsFiltered(updatedCars: Car[]): void {
    console.log(updatedCars);
    if (updatedCars) {
      this.filteredCarsList = updatedCars;
    } else {
      this.filteredCarsList = this.carsList;
    }
  }
}
