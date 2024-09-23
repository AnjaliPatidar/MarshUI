import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { oktaAuthGuard } from './shared/auth/okta-auth.guard';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ oktaAuthGuard ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
