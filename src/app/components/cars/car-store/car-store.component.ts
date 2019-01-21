import { Component, OnInit, ViewChild } from '@angular/core';
import { CarListService } from '../../../shared/services/car-list.service';
import { Car, Config, CarSpecs, RawCar, CarModel } from '../../../interface/car';
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

  fetchedData: RawCar[];    // complete raw cars data
  carsList: Car[];          // complete mapped data of cars
  carsToShow: Car[];        // few cars of mapped cars to show and lazy load further | passed to filter
  filteredCarsList: Car[];  // filtered list of cars being displayed | iterable - displaying cars
  uniqueSpecs: CarSpecs[];  // unique specs from all cars

  isAdmin = false;

  isLiveSearchActive = true;
  errorReturned = false;

  startAt: number;
  carsToShowCount: number;
  loadingMore: boolean;

  constructor(
    private _carsService: CarListService,
    public dialog: MatDialog,
    private _authService: AuthenticationService) { }

  ngOnInit() {
    this.isAdmin = this._authService.getUserType() === 'admin' ? true : false;

    this.carsToShow = [];
    this.startAt = 0;
    this.carsToShowCount = 10;

    this._carsService.getCarData().subscribe((cars: Config) => {
      this.fetchedData = cars.data;
      this.carsList = this._carsService.getMappedObj(this.fetchedData);
      this.loadData();

      console.log('\nfull data: ', this.fetchedData, '\nmapped cars data: ', this.carsList);
    }, error => {
      console.log(error);
      if (error) {
        this.errorReturned = true;
      }
    });
  }

  loadData(loadMore?: boolean) {
    const allCars = [...this.carsList]; // local copy of all car data in mapped form

    if (loadMore) {
      this.loadingMore = true;
      this.filterCarsComponent.clearFilter();
      this.startAt += 10;
    }

    // mocking real-time async call to load more data
    setTimeout(() => {
      this.loadingMore = false;
      this.carsToShow = [...this.carsToShow, ...allCars.splice(this.startAt, this.carsToShowCount)];
      this.filteredCarsList = this.carsToShow;
      this.uniqueSpecs = this._carsService.getUniqueSpecs(this.carsToShow);

      console.log('\ncars to show: ', this.carsToShow, '\nall specs: ', this.uniqueSpecs);
    }, 700);

  }

  // add new car
  openCarAddDialog(): void {
    const dialogRef = this.dialog.open(OperationDialogComponent, {
      width: '500px',
      data: {uniqueSpecs: this.uniqueSpecs}
    });

    dialogRef.afterClosed().subscribe((result: Car) => {
      if (result) {
        this.checkAddedCar(result);
        this.syncCarData();

        console.log('added: ', result, this.carsList.length);
      }
    });
  }

  // remove a car
  onCarRemove(carToRemove: Car): void {
    const carToRemoveIndex = this.carsToShow.map(car => {
      return car.id === carToRemove.id;
    }).indexOf(true);

    this.carsToShow.splice(carToRemoveIndex, 1);
    this.syncCarData();

    console.log('removed: ', carToRemove, this.carsToShow.length);
  }

  // edit existing car
  onCarDetailsEdit(carToEdit: Car): void {
    const carToEditIndex = this.carsToShow.map(car => {
      return car.id === carToEdit.id;
    }).indexOf(true);

    this.carsToShow[carToEditIndex] = carToEdit;
    this.syncCarData();

    console.log('editted: ', carToEdit, this.carsToShow.length, this.fetchedData);
  }

  onCarsFiltered(updatedCars: Car[]): void {
    console.log('filtered cars: ', updatedCars);
    if (updatedCars) {
      this.filteredCarsList = updatedCars;
    } else {
      this.filteredCarsList = this.carsToShow;
    }
  }

  // sync car data after each operation: filtered array, unique specs, etc
  syncCarData(): void {
    this.filteredCarsList = this.carsToShow;

    // check unique specs after every operation
    this.uniqueSpecs = this._carsService.getUniqueSpecs(this.carsToShow);

    // clear all filters on any changes in car data; post change to service for each CRUD
    this.filterCarsComponent.applyFilter();
  }

  /* assign ids to newly added brand/ model/ both and add car to mapped obj if same car doen't already exist
  note: this check is done on master raw object received as http response
  includes all data, not only what is being shown */
  checkAddedCar(newCar: Car): void {
    let similarBrandExists = false, similarModelExists = false, similarBrandId = -1, brandModelCount = 0;

    this.fetchedData.forEach((car: RawCar) => {
      if (car.brand === newCar.brand) {
        similarBrandExists  = true;
        similarBrandId = car.id;
        brandModelCount = car.models.length;
        car.models.forEach((model: CarModel) => {
          if (model.name === newCar.model) {
            similarModelExists = true;
          }
        });
      }
    });

    if (similarBrandExists && !similarModelExists) {
      newCar.brandId = similarBrandId;
      newCar.id = `${newCar.brandId}-${brandModelCount + 1}`;

      this.updateRawData(newCar);
    } else if (similarBrandExists && similarModelExists) {
      console.log('*** CAR ALREADY EXISTS...ABORTING ***');
    } else if (!similarBrandExists && !similarModelExists) {
      newCar.brandId = this.fetchedData.length + 1;
      newCar.id = `${newCar.brandId}-${brandModelCount + 1}`;

      this.updateRawData(newCar, true);

      // POST pushes to the array -> POST fresh added car, but in Raw format
      this._carsService.addCarData(this._carsService.getRawObj(newCar))
        .subscribe( (data: RawCar) => console.log('POST successful!!', data) );
    }

    console.log('*** CAR ADDED ***', this.fetchedData, this.carsList);
  }

  /* reverse mapping newly added car to raw data obj.
  modify this for editing and deleting a car in actual raw data obj --> pending
  this is where post request should be made */
  updateRawData(carToUpdate: Car, isAdded?: boolean): void {
    if (isAdded) {
      this.fetchedData.push({
        brand: carToUpdate.brand,
        id: carToUpdate.brandId,
        models: [],
      });
    }

    // going by the assumption that car id = corresponding index + 1
    this.fetchedData[carToUpdate.brandId - 1]['models'].push({
      colors: carToUpdate.colors,
      engineCapacity: carToUpdate.engineCapacity,
      id: carToUpdate.id,
      imgSrc: carToUpdate.imgSrc,
      name: carToUpdate.model,
      transmission: carToUpdate.transmission,
      type: carToUpdate.type,
      year: carToUpdate.year
    });

    this.carsList.push(carToUpdate);
  }

  goToTop() {
    window.scrollTo(0, 0);
  }
}
