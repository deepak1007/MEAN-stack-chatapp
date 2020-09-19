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
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CreateroomComponent } from './createroom/createroom.component';
import { SearchroomsComponent } from './searchrooms/searchrooms.component';
import { VerifyaccountComponent } from './verifyaccount/verifyaccount.component';
import { ConnectionsComponent } from './connections/connections.component';
import { AddedConnectionsComponent } from './added-connections/added-connections.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { FriendCircleComponent } from './friend-circle/friend-circle.component';


const routes: Routes = [
  
  {path:'', component:NormalpagesComponent, children:[
    {path:'', component:HomeComponent},
    {path:'login', component:LoginComponent},
    {path:'sign-up', component:SignupComponent},
    {path:'contact-us', component:ContactUsComponent},
    {path:'verify-account', component:VerifyaccountComponent}
  ]},

   {path:'home',redirectTo:'',  component:HomeComponent},

  {path:'chat-dashboard', component:ChatzoneComponent, canActivate:[AuthGuard], children:[
    {path:'', component:ProfileComponent},
    {path:'profile', component:ProfileComponent},
    {path:'chat', component:ChatComponent},
    {path:'message-area', component:MessageareaComponent},
    {path:'private-chat', component: PrivateChatComponent},
    {path:'view-profile', component:ViewProfileComponent},
    {path:'create-room', component:CreateroomComponent},
    {path:'search-room', component:SearchroomsComponent},
    {path:"manage-requests", component:ConnectionsComponent},
    {path:"manage-connections", component:FriendCircleComponent},
    {path:"friend-circle", component:FriendCircleComponent}
  ]}, 
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
