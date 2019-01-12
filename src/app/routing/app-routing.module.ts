import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarDetailsComponent } from '../components/cars/car-details/car-details.component';
import { CarStoreComponent } from '../components/cars/car-store/car-store.component';
import { LoginComponent } from '../components/login/login.component';
import { ErrorComponent } from '../components/error/error.component';
import { AuthGuardService } from '../shared/services/guards/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: CarStoreComponent, canActivate: [AuthGuardService] },
  { path: 'details/:carFullName', component: CarDetailsComponent, canActivate: [AuthGuardService] },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
