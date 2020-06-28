import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NormalpagesComponent } from './normalpages/normalpages.component';
import { SecondheaderComponent } from './secondheader/secondheader.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { ChatzoneComponent } from './chatzone/chatzone.component';
import { ChatzonesidenavComponent } from './chatzonesidenav/chatzonesidenav.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatComponent } from './chat/chat.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageareaComponent } from './messagearea/messagearea.component';
import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';

const config:SocketIoConfig = {url:"localhost:8000", options:{transports:['websocket','polling']}};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NormalpagesComponent,
    SecondheaderComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    ChatzoneComponent,
    ChatzonesidenavComponent,
    ProfileComponent,
    ChatComponent,
    MessageareaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
