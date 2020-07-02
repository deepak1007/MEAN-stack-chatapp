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
import { MessageareaComponent } from './messagearea/messagearea.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';


const routes: Routes = [
  
  {path:'', component:NormalpagesComponent, children:[
    {path:'', component:HomeComponent},
    {path:'login', component:LoginComponent},
    {path:'sign-up', component:SignupComponent}
  ]},

   {path:'home',redirectTo:'',  component:HomeComponent},

  {path:'chat-dashboard', component:ChatzoneComponent, canActivate:[AuthGuard], children:[
    {path:'', component:ProfileComponent},
    {path:'profile', component:ProfileComponent},
    {path:'chat', component:ChatComponent},
    {path:'message-area', component:MessageareaComponent},
    {path:'view-profile', component:ViewProfileComponent}
  ]}, 
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
