import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Car } from 'src/app/interface/car';

@Component({
  selector: 'app-filter-cars',
  templateUrl: './filter-cars.component.html',
  styleUrls: ['./filter-cars.component.scss']
})
export class FilterCarsComponent implements OnInit {
  @Input() allCars: Car[];
  @Input() liveSearch: boolean;
  @Input() uniqueSpecs: any[];

  @Output() filterCars = new EventEmitter<Car[]>();

  filteredCars: Car[];
  filterModel = {
    searchString: '',
    brand: [],
    colors: [],
    transmission: [],
    type: []
  };

  constructor() { }

  ngOnInit() {
    this.filteredCars = this.allCars;  // initialize ini onChanges
  }

  onSearchEnter(): void {
    if (this.liveSearch) {
      this.applyFilter();
    }
  }

  applyFilter(): void {
    this.filteredCars = this.allCars;
    const regex = new RegExp(this.filterModel.searchString.replace(' ', ''), 'ig');
    // let filterCount = 0;

    for (const key of Object.keys(this.filterModel)) {
      // console.log(key, this.filterModel[key]);  // use switch case instead
      if (this.filterModel[key].length) {
        if (key === 'searchString') {
          this.filteredCars = this.filteredCars
              .filter(car => {
                return car.brand.match(regex) ||
                       car.model.match(regex) ||
                       `${car.brand}${car.model}this`.match(regex);
              });
        } else {
          const carNow: Car[] = [];
          this.filteredCars.map((car) => {
            this.filterModel[key].map((item: boolean, i: number) => {
              if (item) {
                if ( car[key] === this.uniqueSpecs[key][i] ||
                     car.colors.includes(this.uniqueSpecs[key][i]) ) {
                  carNow.push(car);
                }
              }
            });
          });
          this.filteredCars = carNow;
          // console.log(key, this.filterModel[key], this.filteredCars);
        }
      }

      // if (this.filterModel[key].includes(true) || this.filterModel[key].length) {
      //   filterCount++;
      // }
    }

    if (true) {
      this.filterCars.emit(this.filteredCars);
    }
    // else {
    //   this.filteredCars = this.allCars;
    //   this.filterModel = {
    //     searchString: '',
    //     brand: [],
    //     colors: [],
    //     transmission: [],
    //     type: []
    //   };
    // }
    // console.log(this.filterModel);
  }

  clearFilter(): void {
    this.filterModel.searchString = '';
    this.filterModel = {
      searchString: '',
      brand: [],
      colors: [],
      transmission: [],
      type: []
    };
    this.filterCars.emit(null);
  }
}
