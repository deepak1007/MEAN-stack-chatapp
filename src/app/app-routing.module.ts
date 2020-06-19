import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NormalpagesComponent } from './normalpages/normalpages.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChatzoneComponent } from './chatzone/chatzone.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  
  {path:'', component:NormalpagesComponent, children:[
    {path:'', component:HomeComponent},
    {path:'home', component:HomeComponent},
    {path:'login', component:LoginComponent},
    {path:'sign-up', component:SignupComponent}
  ]},
  {path:'chat-dashboard', component:ChatzoneComponent, canActivate:[AuthGuard], children:[
    {path:'', component:ProfileComponent},
    {path:'profile', component:ProfileComponent},
    {path:'chat', component:ChatComponent}
  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
