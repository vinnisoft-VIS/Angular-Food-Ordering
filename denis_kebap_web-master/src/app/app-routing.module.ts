import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { IsLoggedInGuard } from './auth/guards/is-logged-in.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SelectLocationComponent } from './pages/select-location/select-location.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    component: LoginComponent, path: 'login', canActivate: [IsLoggedInGuard]
  },
  {
    component: SelectLocationComponent, path: 'select-location', canActivate: [AuthGuard]
  },
  {
    component: HomeComponent, path: 'home', canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
