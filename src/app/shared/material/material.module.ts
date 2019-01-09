import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatButtonModule,
  MatTableModule,
  MatSelectModule,
  MatOptionModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatDividerModule,
  MatDialogModule,
  MatTreeModule
} from '@angular/material';

@NgModule({
  exports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTreeModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class MaterialModule { }
