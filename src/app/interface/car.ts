// car object received from srvc call
export interface Config {
  data: Array<RawCar>;
}

export interface RawCar {
  brand: string;
  id: number;
  models: Array<CarModel>;
}

// car models
export interface CarModel {
  colors: Array<string>;
  engineCapacity: number;
  id: string;
  imgSrc: string;
  name: string;
  transmission: string;
  type: string;
  year: number;
}

// mapped car obj
export interface Car {
  brandId: number;
  id: string;
  brand: string;
  model: string;
  colors: Array<string>;
  engineCapacity: number;
  imgSrc: string;
  transmission: string;
  type: string;
  year: number;
}

// filter categories
export interface Filter {
  searchString: string;
  brand: Array<boolean>;
  colors: Array<boolean>;
  transmission: Array<boolean>;
  type: Array<boolean>;
}

// unique car specs
export interface CarSpecs {
  brand: Array<string>;
  colors: Array<string>;
  transmission: Array<string>;
  type: Array<string>;
}

// auth obj
export interface Auth {
  username: string;
  password: string;
  role: string;
}

