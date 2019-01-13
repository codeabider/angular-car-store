import { Injectable } from '@angular/core';
import { Car, TheCar, CarSpecs } from '../../interface/car';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarListService {
  url = 'assets/data/future-cars.json';  // local --> use for deployement

  // note:; in order to use json-server, we need to congifgure angular Proxy,
  // so that our data is served from localhost:4200/. localhost requests/ responses are blocked by CORS
  // use to get, post, delete data from mock API
  // url = 'http://localhost:4200/db';

  constructor(private _http: HttpClient) { }


  // note: instead of piping each service request, using interceptors (ng 4.3.1+) to handle all errors globally
  getCarData(): Observable<TheCar> {
    return this._http.get<TheCar>(this.url);
  }

  // doesn't work currently with local data | see supported requested types and params
  postCarData(cars: Car[]): Observable<TheCar> {
    return this._http.post<TheCar>(this.url, cars);
  }

  // pagination limits, searches, sorts, etc can be done using mock API provided by json-server
  // following local json approach here, to map received data into usable obj
  // and performing all operations on that obj
  getMappedObj(cars: TheCar, brandLimit = 2, modelLimit = 5): Car[] {  // model limit pending
    const carsList: Car[] = [];
    const brandList = cars['brands'].splice(20, brandLimit);

    cars['models'].map((model) => {
      brandList.map((brand) => {
        if (brand.id === model.brandId) {
          carsList.push({
            id: model.id,
            brand: brand.name,
            model: model.name,
            year: model.year,
            type: model.type,
            engineCapacity: model.engineCapacity,
            colors: model.colors,
            transmission: model.transmission,
            imgSrc: model.imgSrc
          });
        }
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

  // just for demo
  // getData() {
  //   const source =
  //     from(this.getCarData())
  //     .pipe(
  //       map( ({ brands }) => brands )
  //     );

  //   source.subscribe(data => console.log('getData rxjs ops: ', data));
  // }

  // getCars(): Car[] {
  //   return this.carsList;
  // }

  // postCar(car: Car): void {
  //   this.carsList.push(car);
  // }
}
