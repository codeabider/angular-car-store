import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Car } from '../../../interface/car';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-operation-dialog',
  templateUrl: './operation-dialog.component.html',
  styleUrls: ['./operation-dialog.component.scss']
})
export class OperationDialogComponent implements OnInit {
  carDetails: Car;
  carDetailsForm: FormGroup;

  transmissionType: string[];
  carType: string[];

  constructor(
    public dialogRef: MatDialogRef<OperationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public carData: any,
    private _formBuilder: FormBuilder) {}

  ngOnInit() {
    console.log('------passed to Dialog------\n', this.carData);
    if (!this.carData.remove) {
      this.carDetailsForm = this._formBuilder.group({
        // each mappedObj 'id' will be unique: (brand id - model id)
        brandId: [this.carData.car ? this.carData.car.brandId : -1],
        id: [this.carData.car ? this.carData.car.id : '-1'],
        brand: [this.carData.car ? this.carData.car.brand : '', Validators.required],
        model: [this.carData.car ? this.carData.car.model : '', Validators.required],
        colors: this._formBuilder.array(this.carData.car ? this.carData.car.colors : ['']),
        engineCapacity: [this.carData.car ? this.carData.car.engineCapacity : 20, Validators.required],
        imgSrc: [this.carData.car ? this.carData.car.imgSrc : ''],
        transmission: [this.carData.car ? this.carData.car.transmission : '', Validators.required],
        type: [this.carData.car ? this.carData.car.type : '', Validators.required],
        year: [this.carData.car ? this.carData.car.year : 1900, Validators.required]
      });

      if (this.carData.uniqueSpecs) {
        this.transmissionType = this.carData.uniqueSpecs['transmission'];
        this.carType = this.carData.uniqueSpecs['type'];
      }
    }
  }

  get brand() {
    return this.carDetailsForm.get('brand');
  }

  get model() {
    return this.carDetailsForm.get('model');
  }

  get year() {
    return this.carDetailsForm.get('year');
  }

  get type() {
    return this.carDetailsForm.get('type');
  }

  get engineCapacity() {
    return this.carDetailsForm.get('engineCapacity');
  }

  get transmission() {
    return this.carDetailsForm.get('transmission');
  }

  get colors() {
    return this.carDetailsForm.get('colors') as FormArray;
  }

  onInputBlur(control: FormControl) {
    control.patchValue(this.capitalize(control.value));
  }

  addColor(): void {
    this.colors.push(this._formBuilder.control(''));
  }

  removeColor(index: number): void {
    this.colors.removeAt(index);
  }

  onNoClick(action: boolean): void {
    if (this.carData.remove) {
      this.dialogRef.close(action);
    }
  }

  updateData(): void {
    this.dialogRef.close(this.carDetailsForm.value);
  }

  resetData(fillDefault?: string): void {
    this.carDetailsForm.patchValue({
      brand: fillDefault ? 'BMW' : '',
      model: fillDefault ? 'M6' : '',
      year: fillDefault ? 2016 : 1900,
      type: fillDefault ? 'Sedan' : '',
      engineCapacity: fillDefault ? 25 : 20,
      transmission: fillDefault ? 'Auto' : ''
    });
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getErrorMsg(errors: any): any {
    if (errors) {
      return errors.required ? 'This field is required!' : '';
    }
  }
}
