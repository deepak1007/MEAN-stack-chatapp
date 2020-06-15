import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
  }

  onSignup(data)
  {
     alert(data);
  }

}
