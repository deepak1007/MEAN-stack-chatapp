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
  }

  onSignup()
  {
   this.ds.signup({firstname:this.valuefirstName, lastname:this.valuelastName, email:this.valueemail, password:this.valuepassword}).subscribe((response)=>{
      if(response.status == "ok"){
        alert("congratulations you are registered please login to continue");
        this.router.navigate(['/login']);
      }
   })
  }

}
