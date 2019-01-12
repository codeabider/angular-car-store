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

