import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  valuefirstName;
  valuelastName;
  valueemail;
  valuepassword;
  valueconfirmPassword;
  constructor(private ds:DataService, private router: Router) { }

  ngOnInit(): void {
    if(window.innerWidth <=600){
      var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
      secondheader.style.display = "none";
      var nav_show_btn =  <HTMLElement><any> document.getElementsByClassName("nav-show-btn")[0];
      nav_show_btn.textContent = "=";
    }
  }

  onSignup()
  {
   this.ds.signup({firstname:this.valuefirstName, lastname:this.valuelastName, email:this.valueemail, password:this.valuepassword, about:"" , gender:""}).subscribe((response)=>{
      if(response.status == true){
        alert("congratulations you are registered please login to continue");
        this.router.navigate(['/login']);
      }else{
        alert(response.data.err);
      }
   })
  }

}
