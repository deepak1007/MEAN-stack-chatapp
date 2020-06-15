import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  valuepassword;
  valueemail;
  constructor() { }

  ngOnInit(): void {
  }
  
  onLogin(data){
    console.warn(data);
  }
}
