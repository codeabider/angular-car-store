import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, HostListener } from '@angular/core';
import { Car, Filter, CarSpecs } from 'src/app/interface/car';

@Component({
  selector: 'app-filter-cars',
  templateUrl: './filter-cars.component.html',
  styleUrls: ['./filter-cars.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterCarsComponent implements OnInit {
  @Input() allCars: Car[];
  @Input() liveSearch: boolean;
  @Input() uniqueSpecs: CarSpecs[];

  @Output() filterCars = new EventEmitter<Car[]>();

  filteredCars: Car[];
  filterModel: Filter = {
    searchString: '',
    brand: [],
    colors: [],
    transmission: [],
    type: []
  };

  isMobile: boolean;

  constructor() { }

  ngOnInit() {
    this.filteredCars = this.allCars;  // initialize ini onChanges
    this.checkView();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkView();
  }

  checkView() {
    if (window.innerWidth < 768) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  onSearchEnter(): void {
    if (this.liveSearch) {
      this.applyFilter();
    }
  }

  // highly complex in space n time -- try to optimize
  applyFilter(): void {
    this.filteredCars = this.allCars;
    const regex = new RegExp(this.filterModel.searchString.replace(' ', ''), 'ig');
    let uniqueFilterCount = 0;
    // let matchedColors = [];

    for (const key of Object.keys(this.filterModel)) {
      uniqueFilterCount = 0;
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
          let carNow: Car[];

          this.filterModel[key].map((item: boolean) => item ? uniqueFilterCount++ : uniqueFilterCount);
          carNow = uniqueFilterCount ? [] : this.filteredCars;

          this.filteredCars.map((car) => {
            this.filterModel[key].map((item: boolean, i: number) => {
              if ( item &&
                   (car[key] === this.uniqueSpecs[key][i] ||
                   car.colors.includes(this.uniqueSpecs[key][i])) ) {
                carNow.push(car);
              }
            });
          });
          this.filteredCars = carNow;

          console.log(key, ': ', uniqueFilterCount);
          // console.log(key, this.filterModel[key], this.filteredCars);
        }
      }
    }

    if (true) { // condition??
      this.filterCars.emit(this.filteredCars);
    }
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
