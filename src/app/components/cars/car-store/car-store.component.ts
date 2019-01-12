import { Component, OnInit, ViewChild } from '@angular/core';
import { CarListService } from '../../../shared/services/car-list.service';
import { Car, TheCar, CarSpecs } from '../../../interface/car';
import { MatDialog } from '@angular/material';
import { OperationDialogComponent } from '../operation-dialog/operation-dialog.component';
import { FilterCarsComponent } from '../filter-cars/filter-cars.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-car-store',
  templateUrl: './car-store.component.html',
  styleUrls: ['./car-store.component.scss']
})
export class CarStoreComponent implements OnInit {
  @ViewChild( FilterCarsComponent ) filterCarsComponent: FilterCarsComponent;

  fetchedData: TheCar;
  carsList: Car[];
  filteredCarsList: Car[];
  uniqueSpecs: CarSpecs[];

  isAdmin = false;

  isLiveSearchActive = true;
  isDataLoaded = false;

  constructor(
    private _carsService: CarListService,
    public dialog: MatDialog,
    private _authService: AuthenticationService) { }

  ngOnInit() {
    this.isAdmin = this._authService.getUserType() === 'admin' ? true : false;

    this._carsService.getJSON().subscribe((cars: TheCar) => {
      this.fetchedData = cars;
      this.carsList = this._carsService.getMappedObj(this.fetchedData);
      this.filteredCarsList = this.carsList;
      this.isDataLoaded = true;

      this.uniqueSpecs = this._carsService.getUniqueSpecs(this.carsList);

      console.log('\nfull data: ', this.fetchedData, '\nmapped cars: ', this.carsList);
      console.log('\nall specs: ', this._carsService.getUniqueSpecs(this.carsList));
    });

    // service method to return an object containing unique car attributes
  }

  // add new car
  openCarAddDialog(): void {
    const dialogRef = this.dialog.open(OperationDialogComponent, {
      width: '500px',
      data: {uniqueSpecs: this.uniqueSpecs}
    });

    dialogRef.afterClosed().subscribe((result: Car) => {
      if (result) {
        this.carsList.push(result);

        this.syncCarData(); // sync car data after each operation: filtered array, unique specs, etc

        console.log('added: ', result, this.carsList.length);
      }
    });
  }

  // remove a car
  onCarRemove(carToRemove: Car): void {
    const carToRemoveIndex = this.carsList.map(car => {
      return `${car.brand}${car.model}` === `${carToRemove.brand}${carToRemove.model}`;
    }).indexOf(true);

    this.carsList.splice(carToRemoveIndex, 1);

    this.syncCarData(); // sync car data after each operation: filtered array, unique specs, etc

    console.log('removed: ', carToRemove, this.carsList.length);
  }

  // edit existing car
  onCarDetailsEdit(carToEdit: Car): void {
    const carToEditIndex = this.carsList.map(car => {
      return `${car.brand}${car.model}` === `${carToEdit.brand}${carToEdit.model}`;
    }).indexOf(true);

    this.carsList[carToEditIndex] = carToEdit;

    this.syncCarData(); // sync car data after each operation: filtered array, unique specs, etc

    console.log('editted: ', carToEdit, this.carsList.length);
  }

  onCarsFiltered(updatedCars: Car[]): void {
    console.log('filtered cars: ', updatedCars);
    if (updatedCars) {
      this.filteredCarsList = updatedCars;
    } else {
      this.filteredCarsList = this.carsList;
    }
  }

  syncCarData(): void {
    this.filteredCarsList = [...this.carsList];

    this.uniqueSpecs = this._carsService.getUniqueSpecs(this.carsList); // check unique specs after every operation
    this.filterCarsComponent.applyFilter(); // clear all filters on any changes in car data
    // post change to service for each CRUD
  }

  goToTop() {
    window.scrollTo(0, 0);
  }
}
