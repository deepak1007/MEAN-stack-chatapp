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
    
  }
  
  onLogin(){
       this.ds.login({email:this.valueemail, password:this.valuepassword}).subscribe((response)=>{
       localStorage.setItem("email", response.data.email);
       this.route.navigate(['/chat-dashboard']);
    })
  }

  
}
