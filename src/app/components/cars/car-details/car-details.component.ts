import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Car } from '../../../interface/car';
import { MatDialog } from '@angular/material';
import { OperationDialogComponent } from '../operation-dialog/operation-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CarListService } from '../../../shared/services/car-list.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss']
})
export class CarDetailsComponent implements OnInit {
  @Input() car: Car;
  @Input() carIndex: number;

  @Output() removed = new EventEmitter<any>();
  @Output() detailsEdit = new EventEmitter<any>();

  isRouted = false;

  constructor(
    public dialog: MatDialog,
    private _router: Router,
    private _route: ActivatedRoute,
    private _carsService: CarListService) { }

  ngOnInit() {
    // check from URL, whether the component is routed or part of parent
    const carIndex = this._route.snapshot.paramMap.get('index');
    if (carIndex) {
      this.isRouted = true;
      this.car = this._carsService.getCars()[carIndex];
    }
  }

  openCarRemoveDialog(): void {
    const dialogRef = this.dialog.open(OperationDialogComponent, {
      width: '300px',
      data: {'remove': true}
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.removed.emit(this.car);
      }
    });
  }

  openCarEditDialog(): void {
    const dialogRef = this.dialog.open(OperationDialogComponent, {
      width: '500px',
      data: this.car
    });

    dialogRef.afterClosed().subscribe((result: Car) => {
      if (result) {
        this.detailsEdit.emit(result);
      }
    });
  }

  showCarDetails() {
    this._router.navigate(['/details', this.carIndex]);
  }

  goBack() {
    this._router.navigate(['/home']);
  }
}
