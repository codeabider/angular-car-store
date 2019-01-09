import { Injectable } from '@angular/core';
import { Car } from 'src/app/interface/car';

const CARS = [
  {
    id: 1,
    brand: 'Audi',
    modelName: '100',
    modelYear: 1984,
    type: 'Sedan',
    engineCapacity: 20,
    colors: ['red', 'green', 'blue'],
    transmission: 'Manual'
  },
  {
    id: 2,
    brand: 'Audi',
    modelName: '100 Avant',
    modelYear: 2011,
    type: 'Hatchback',
    engineCapacity: 20,
    colors: ['red', 'green', 'blue'],
    transmission: 'Manual'
  },
  {
    id: 3,
    brand: 'Audi',
    modelName: '80 Cabrio',
    modelYear: 2018,
    type: 'SUV',
    engineCapacity: 20,
    colors: ['red', 'green', 'blue'],
    transmission: 'Manual'
  },
  {
    id: 4,
    brand: 'Audi',
    modelName: 'A3 Cabriolet',
    modelYear: 1999,
    type: 'Sedan',
    engineCapacity: 20,
    colors: ['red', 'green', 'blue'],
    transmission: 'Manual'
  }
];

@Injectable({
  providedIn: 'root'
})
export class CarListService {
  carsList: Car[] = CARS;

  constructor() { }

  getCars(): Car[] {
    return this.carsList;
  }

  postCar(car: Car): void {
    this.carsList.push(car);
  }
}
