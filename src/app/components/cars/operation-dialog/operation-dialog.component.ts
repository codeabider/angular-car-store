import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Car } from '../../../interface/car';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-operation-dialog',
  templateUrl: './operation-dialog.component.html',
  styleUrls: ['./operation-dialog.component.scss']
})
export class OperationDialogComponent implements OnInit {
  carDetails: Car;
  carDetailsForm: FormGroup;
  transmissionType: string[] = ['Manual', 'Auto', 'Hybrid'];

  constructor(
    public dialogRef: MatDialogRef<OperationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public carData: any,
    private _formBuilder: FormBuilder) {}

  ngOnInit() {
    const random = Math.ceil(50 + Math.random() * 100);
    // console.log(this.carData);
    if (!(this.carData && this.carData.remove)) {
      this.carDetailsForm = this._formBuilder.group({
        id: [this.carData ? this.carData.id : random],
        brand: [this.carData ? this.carData.brand : '', Validators.required],
        modelName: [this.carData ? this.carData.modelName : '', Validators.required],
        modelYear: [this.carData ? this.carData.modelYear : 1900, Validators.required],
        type: [this.carData ? this.carData.type : '', Validators.required],
        engineCapacity: [this.carData ? this.carData.engineCapacity : 20, Validators.required],
        transmission: [this.carData ? this.carData.transmission : '', Validators.required],
        colors: this._formBuilder.array(this.carData ? this.carData.colors : [''])
      });
    }
  }

  get brand() {
    return this.carDetailsForm.get('brand');
  }

  get modelName() {
    return this.carDetailsForm.get('modelName');
  }

  get modelYear() {
    return this.carDetailsForm.get('modelYear');
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

  addColor(): void {
    this.colors.push(this._formBuilder.control(''));
  }

  removeColor(index: number) {
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
      modelName: fillDefault ? 'M6' : '',
      modelYear: fillDefault ? 2016 : 1900,
      type: fillDefault ? 'Sedan' : '',
      engineCapacity: fillDefault ? 25 : 20,
      transmission: fillDefault ? 'Auto' : ''
    });
  }

  getErrorMsg(errors: any) {
    if (errors) {
      return errors.required ? 'This field is required!' : '';
    }
  }
}
