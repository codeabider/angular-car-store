import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Car } from 'src/app/interface/car';

@Component({
  selector: 'app-filter-cars',
  templateUrl: './filter-cars.component.html',
  styleUrls: ['./filter-cars.component.scss']
})
export class FilterCarsComponent implements OnInit {
  @Input() allCars: Car[];

  @Output() filterCars = new EventEmitter<Car[]>();

  searchString: string;

  constructor() { }

  ngOnInit() {
  }

  filter(): Car[] {
    return this.allCars.filter(car => car.brand.indexOf(this.searchString) > -1 || car.modelName.indexOf(this.searchString) > -1);
  }

  applyFilter(): void {
    if (this.searchString) {
      this.filterCars.emit(this.filter());
    }
  }

  clearFilter(): void {
    this.searchString = '';
    this.filterCars.emit(null);
  }
}
