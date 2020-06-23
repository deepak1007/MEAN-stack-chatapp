import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  valuepassword;
  valueemail;
  constructor(private ds:DataService, private route:Router) { }

  ngOnInit(): void {

    //shows nav-show-btn in header only when visiting normal pages and if the window width is less then 600px and hides the second header when any nav button is clicked;
    if(window.innerWidth <=600){
      var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
      secondheader.style.display = "none";
      var nav_show_btn =  <HTMLElement><any> document.getElementsByClassName("nav-show-btn")[0];
      nav_show_btn.textContent = "=";
    }
    //----------------------

  }
  
  onLogin(){
       this.ds.login({email:this.valueemail, password:this.valuepassword}).subscribe((response)=>{
        //get the response and fill it in cookie and then fill the details object in data.service to make it available all the time to profile page and other pages. 
       localStorage.setItem("email", response.data.email);
       this.ds.filldetails({FullName: response.data.FullName, email:response.data.email, password:"abcdefghijk"});
       this.route.navigate(['/chat-dashboard']);
    })
  }

  
}
