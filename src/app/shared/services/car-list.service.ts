import { Injectable } from '@angular/core';
import { Car, Config, CarSpecs, RawCar, CarModel } from '../../interface/car';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarListService {
  url = 'assets/data/cars.json';  // local --> use for deployement

  // note: in order to use json-server, we need to congifgure angular Proxy,
  // so that our data is served from localhost:4200/. localhost requests/ responses are blocked by CORS
  // use to get, post, delete data from mock API
  // url = '/db';

  constructor(private _http: HttpClient) { }


  // note: instead of piping each service request, using interceptors (ng 4.3.1+) to handle all errors globally
  getCarData(): Observable<Config> {
    return this._http.get<Config>(this.url);
  }

  // POST pushes to the array -> using in case when brand new car is added
  addCarData(newCar: RawCar): Observable<RawCar> {
    console.log('posting: ', newCar);
    return this._http.post<RawCar>('/data', newCar);
  }

  // deleteCarData(carToDelete: RawCar): Observable<RawCar> {
  //   console.log('posting: ', carToDelete);
  //   return this._http.delete<RawCar>(`/data`, carToDelete);
  // }

  // pagination limits, searches, sorts, etc can be done using mock API provided by json-server
  // following local json approach here, to map received data into usable obj
  // and performing all operations on that obj
  getMappedObj(cars: RawCar[]): Car[] {  // implement lazy load
    const carsList: Car[] = [];

    cars.forEach((car: RawCar, carIndex: number) => {
      car.models.forEach((model: CarModel, modelIndex: number) => {
        carsList.push({
          brandId: car.id,
          id: model.id,
          brand: car.brand,
          model: model.name,
          colors: model.colors,
          engineCapacity: model.engineCapacity,
          imgSrc: model.imgSrc,
          transmission: model.transmission,
          type: model.type,
          year: model.year
        });
      });
    });

    return carsList;
  }

  getRawObj(mappedCar: Car): RawCar {
    return {
      brand: mappedCar.brand,
      id: mappedCar.brandId,
      models: [{
        colors: mappedCar.colors,
        engineCapacity: mappedCar.engineCapacity,
        id: mappedCar.id,
        imgSrc: mappedCar.imgSrc,
        name: mappedCar.model,
        transmission: mappedCar.transmission,
        type: mappedCar.type,
        year: mappedCar.year
      }]
    };
  }

  getUniqueSpecs(cars: Car[]): any {
    const allBrand = cars.map(car => car.brand);
    const allType = cars.map(car => car.type);
    const allTransmission = cars.map(car => car.transmission);
    const allColors = cars.map(car => car.colors).join().split(',');

    const uniqueBrand = Array.from(new Set(allBrand));
    const uniqueType = Array.from(new Set(allType));
    const uniqueTransmission = Array.from(new Set(allTransmission));
    const uniqueColors = Array.from(new Set(allColors));

    const uniqueSpecs: CarSpecs = {
      brand: uniqueBrand,
      colors: uniqueColors,
      transmission: uniqueTransmission,
      type: uniqueType
    };

    return uniqueSpecs;
  }
}
