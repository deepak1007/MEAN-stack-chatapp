import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NormalpagesComponent } from './normalpages/normalpages.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';


const routes: Routes = [
  
  {path:'', component:NormalpagesComponent, children:[
    {path:'', component:HomeComponent},
    {path:'home', component:HomeComponent},
    {path:'login', component:LoginComponent},
    {path:'sign-up', component:SignupComponent}
  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
