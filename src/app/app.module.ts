import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './routing/app-routing.module';
import { MaterialModule } from './shared/material/material.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarStoreComponent } from './components/cars/car-store/car-store.component';
import { CarDetailsComponent } from './components/cars/car-details/car-details.component';
import { OperationDialogComponent } from './components/cars/operation-dialog/operation-dialog.component';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    CarStoreComponent,
    CarDetailsComponent,
    OperationDialogComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule
  ],
  entryComponents: [OperationDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
