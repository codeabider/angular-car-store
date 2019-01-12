// car object received from srvc call
export interface TheCar {
  brands: Array<CarBrand>;
  models: Array<CarModel>;
}

// car brands
export interface CarBrand {
  id: number;
  name: string;
}

// car models
export interface CarModel {
  brandId: number;
  colors: Array<string>;
  engineCapacity: number;
  id: number;
  name: string;
  imgSrc: string;
  transmission: string;
  type: string;
  year: number;
}

// mapped car obj for UI
export interface Car {
  brand: string;
  colors: Array<string>;
  engineCapacity: number;
  id: number;
  model: string;
  imgSrc: string;
  transmission: string;
  type: string;
  year: number;
}
