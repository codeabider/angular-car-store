import { Component, OnInit, ViewChild } from '@angular/core';
import { CarListService } from '../../../shared/services/car-list.service';
import { Car, Config, CarSpecs, RawCar, CarModel } from '../../../interface/car';
import { MatDialog, MatSnackBar } from '@angular/material';
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

  fetchedData: RawCar[];      // complete raw cars data
  carsList: Car[];            // complete mapped data of cars
  carsToShow: Car[];          // few cars of mapped cars to show and lazy load further | passed to filter
  filteredCarsList: Car[];    // filtered list of cars being displayed | iterable - displaying cars
  uniqueSpecs: CarSpecs[];    // unique specs from all cars

  isAdmin = false;            // show few features to admin only

  isLiveSearchActive = true;  // if true, car list should be filtered as checkboxes are checked/ unchecked
  filterApplied = false;      // disable load more btn if filters are applied
  errorReturned = false;

  startAt: number;
  carsToShowCount: number;
  loadingMore: boolean;       // show loader or load more btn conditionally

  snackMessage = {
    message: '',
    action: 'Cool!'
  };

  constructor(
    private _carsService: CarListService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private _authService: AuthenticationService) { }

  ngOnInit() {
    this.isAdmin = this._authService.getUserType() === 'admin' ? true : false;

    this.carsToShow = [];
    this.startAt = 0;
    this.carsToShowCount = 6;

    this._carsService.getCarData().subscribe((cars: Config) => {
      this.fetchedData = cars.data;                                       // complete raw data
      this.carsList = this._carsService.getMappedObj(this.fetchedData);   // complete mappedObj w/ all data
      this.uniqueSpecs = this._carsService.getUniqueSpecs(this.carsList); // get uniqueSpecs from full data

      console.log('\nfull data: ', this.fetchedData,
                  '\nmapped cars data: ', this.carsList,
                  '\nall specs: ', this.uniqueSpecs);

      this.loadData();
    }, error => {
      console.log(error);
      if (error) {
        this.errorReturned = true;
      }
    });
  }

  // not using ngx-infinite-scroll as it has issues with filter as scrolled down --> fix in future
  onScroll() {
    // console.log('SCROLLED...!!!');
    // this.loadData(true);
  }

  loadData(loadMore?: boolean) {
    const allCars = [...this.carsList]; // local copy of all car data in mapped form

    if (loadMore) {
      this.loadingMore = true;
      // this.filterCarsComponent.clearFilter();
      this.startAt += this.carsToShowCount;
    }

    // mocking real-time async call to load more data
    setTimeout(() => {
      this.loadingMore = false;
      // this.carsToShow = [...allCars];
      this.carsToShow = [...this.carsToShow, ...allCars.splice(this.startAt, this.carsToShowCount)];
      this.filteredCarsList = this.carsToShow;
      console.log('\ncars to show: ', this.carsToShow);
    }, 300);
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
    this.updateRawData(carToRemove, 'removeCar');

    console.log('removed: ', carToRemove, this.carsToShow.length);
  }

  // edit existing car
  onCarDetailsEdit(carToEdit: Car): void {
    const carToEditIndex = this.carsToShow.map(car => {
      return car.id === carToEdit.id;
    }).indexOf(true);

    this.carsToShow[carToEditIndex] = carToEdit;
    this.updateRawData(carToEdit, 'editCar');

    console.log('editted: ', carToEdit, this.carsToShow.length, this.fetchedData);
  }

  onCarsFiltered(updatedCars: Car[]): void {
    console.log('filtered cars: ', updatedCars);
    if (updatedCars) {
      this.filteredCarsList = updatedCars;
    } else {
      this.filteredCarsList = this.carsToShow;
    }

    // disabling lazy load on scroll to bottom/ load more btn when filter(s) are applied
    if (updatedCars && updatedCars.length !== this.carsToShow.length) {
      this.filterApplied = true;
    } else {
      this.filterApplied = false;
    }
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

      this.updateRawData(newCar, 'addNewModel');
    } else if (similarBrandExists && similarModelExists) {
      this.updateRawData(newCar, 'noAction');
    } else if (!similarBrandExists && !similarModelExists) {
      newCar.brandId = this.fetchedData.length + 1;
      newCar.id = `${newCar.brandId}-${brandModelCount + 1}`;

      this.updateRawData(newCar, 'addNew');
    }
  }

  // reverse mapping newly added car to raw data obj
  updateRawData(car: Car, updateType: string): void {
    let modelIndex = 0;
    switch (updateType) {
      case 'addNew':
        // add new brand and then add model to it --> new brand will be added once along w/ new model #1
        this.fetchedData.push({
          id: car.brandId,
          brand: car.brand,
          models: [{
            id: car.id,
            name: car.model,
            year: car.year,
            type: car.type,
            engineCapacity: car.engineCapacity,
            colors: car.colors,
            transmission: car.transmission,
            imgSrc: car.imgSrc
          }]
        });

        // updating mapped cars obj
        this.carsList.push(car);

        // POST pushes to the array -> POST fresh added car, but in Raw format (=> add brand new car)
        this._carsService.addCarData(this.fetchedData[car.brandId - 1])
          .subscribe( (data: RawCar) => {
            this.syncCarData();
            console.log('BRAND NEW CAR ADDED: ', data);
          } );

        this.snackMessage.message = `Added new brand: ${car.brand} and ${car.model}.`;

        break;

      case 'addNewModel':
        // adding new model to respective brand in raw data
        this.fetchedData[car.brandId - 1]['models'].push({
          id: car.id,
          name: car.model,
          year: car.year,
          type: car.type,
          engineCapacity: car.engineCapacity,
          colors: car.colors,
          transmission: car.transmission,
          imgSrc: car.imgSrc
        });

        // updating mapped cars obj
        this.carsList.forEach((thisCar: Car, index: number) => {
          if (thisCar.id === car.id) {
            this.carsList.splice(index, 0, car);
          }
        });
        // update cars list on adding new model to existing brand --> pending
        // sending entire updated brand obj and brand index to patch (=> update brand w/ new model)
        this._carsService.updateCarData(this.fetchedData[car.brandId - 1], car.brandId)
          .subscribe( (data: RawCar) => {
            this.syncCarData();
            console.log('NEW MODEL ADDED TO EXISTING BRAND: ', data);
          } );

        this.snackMessage.message = `${car.model} added to ${car.brand}.`;

        break;

      case 'removeCar':
        // picking model index from mappedObj.model.id
        modelIndex = parseInt(car.id.split('-')[1], 10) - 1;
        // removing particular model from raw data
        this.fetchedData[car.brandId - 1]['models'].splice(modelIndex, 1);

        // updating mapped cars obj
        this.carsList.forEach((thisCar: Car, index: number) => {
          if (thisCar.id === car.id) {
            this.carsList.splice(index, 1);
          }
        });

        if (this.fetchedData[car.brandId - 1]['models'].length) {
          // sending entire updated brand obj and brand index to patch (=> delete model from brand)
          this._carsService.updateCarData(this.fetchedData[car.brandId - 1], car.brandId)
          .subscribe( (data: RawCar) => {
            this.syncCarData();
            console.log('MODEL REMOVED FROM BRAND: ', data);
          } );

          this.snackMessage.message = `${car.model} removed from ${car.brand}.`;
        } else {
          // if last model is deleted, delete complete brand
          this._carsService.removeCarData(car.brandId)
          .subscribe( (data: RawCar) => {
            this.syncCarData();
            console.log('WHOLE CAR REMOVED: ', data);
          } );

          this.snackMessage.message = `${car.brand} removed as ${car.model} was the only model.`;
        }

        break;

      case 'editCar':
        // picking model index from mappedObj.model.id
        modelIndex = parseInt(car.id.split('-')[1], 10) - 1;
        // removing particular model from raw data
        this.fetchedData[car.brandId - 1]['models'][modelIndex] = {
          id: car.id,
          name: car.model,
          year: car.year,
          type: car.type,
          engineCapacity: car.engineCapacity,
          colors: car.colors,
          transmission: car.transmission,
          imgSrc: car.imgSrc
        };

        // updating mapped cars obj
        this.carsList.forEach((thisCar: Car, index: number) => {
          if (thisCar.id === car.id) {
            this.carsList[index] = car;
          }
        });

        // sending entire updated brand obj and brand index to patch (=> edit model in brand)
        this._carsService.updateCarData(this.fetchedData[car.brandId - 1], car.brandId)
          .subscribe( (data: RawCar) => {
            this.syncCarData();
            console.log('CAR EDITTED: ', data);
          } );

        this.snackMessage.message = `Editted records for ${car.brand} ${car.model}.`;

        break;

      default:
        console.log('*** CAR ALREADY EXISTS...ABORTING ***');
        this.snackMessage.message = `${car.brand} ${car.model} already exists. Nothing updated!`;

        break;
    }

    this.showActionSnack(this.snackMessage.message, this.snackMessage.action);
    console.log('Updated RAW CARS: ', this.fetchedData);
  }

  // sync car data after each operation: filtered array, unique specs, etc
  syncCarData(): void {
    // this.carsToShow = [];
    // // this.carsList = this._carsService.getMappedObj(this.fetchedData);
    // const allCars = [...this.carsList];
    // this.carsToShow = [...this.carsToShow, ...allCars.splice(this.startAt, this.carsToShowCount)];
    // this.filteredCarsList = this.carsToShow;
    // this.filterCarsComponent.applyFilter();
  }

  goToTop(): void {
    window.scrollTo(0, 0);
  }

  showActionSnack(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
