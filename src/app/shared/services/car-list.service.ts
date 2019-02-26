import { Injectable } from '@angular/core';
import { Car, Config, CarSpecs, RawCar, CarModel } from '../../interface/car';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarListService {
  /* note: in order to use json-server, we need to congigure angular Proxy,
    so that our data is served from localhost:4200/. localhost requests/ responses are blocked by CORS
    use to get, post, delete data from mock API */
  url = {
    localURL: 'assets/data/cars.json',  // local --> use for deployement
    getURL: '/db',
    setURL: '/data'
  };

  useLocal = false;

  constructor(private _http: HttpClient) { }

  // note: instead of piping each service request, using interceptors (ng 4.3.1+) to handle all errors globally
  getCarData(): Observable<Config> {
    if (!this.useLocal) {
      return this._http.get<Config>(this.url.getURL);
    } else {
      return this._http.get<Config>(this.url.localURL);
    }
  }

  // POST pushes to the array -> using in case when brand new car is added
  addCarData(newCar: RawCar): Observable<RawCar> {
    if (!this.useLocal) {
      return this._http.post<RawCar>(this.url.setURL, newCar);
    } else {
      console.log('operation not possible with dummy local JSON!');
    }
  }

  /* PATCH in case of new model added to existing brand
    OR existing car model editted
    OR model deleted from brands */
  updateCarData(car: RawCar, carToUpdateIndex: number): Observable<RawCar> {
    if (!this.useLocal) {
      return this._http.patch<RawCar>(`${this.url.setURL}/${carToUpdateIndex}`, car);
    } else {
      console.log('operation not possible with dummy local JSON!');
    }
  }

  // DELETE the whole brand if no models remain after delete ops
  removeCarData(carToRemoveIndex: number): Observable<RawCar> {
    if (!this.useLocal) {
      return this._http.delete<RawCar>(`${this.url.setURL}/${carToRemoveIndex}`);
    } else {
      console.log('operation not possible with dummy local JSON!');
    }
  }

  /* pagination limits, searches, sorts, etc can be done using mock API provided by json-server
    following local json approach here, to map received data into usable obj
    and performing all operations on that obj */
  getMappedObj(cars: RawCar[]): Car[] {  // implement lazy load
    const carsList: Car[] = [];

    cars.forEach((car: RawCar) => {
      car.models.forEach((model: CarModel) => {
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
