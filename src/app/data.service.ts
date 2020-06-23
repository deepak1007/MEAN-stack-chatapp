import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  details;
  constructor(private httpclient: HttpClient) { }
  
 

  filldetails(data){
    //takes the data from login and fills it in details object , this can be used through out the execution.
    this.details = {};
    this.details.FullName = data.FullName;
    this.details.email = data.email;
    this.details.password = data.password;
    console.log(data);
  }

  
  login(data):any{
    
    return this.httpclient.post('http://localhost:8000/login', data);
  }
  
  signup(data):any{
    return this.httpclient.post('http://localhost:8000/sign-up', data);
  }

  authenticationCheck():Boolean{
    if(localStorage.getItem('email')){
      return true;
    }
    else{
      return false;
    }
  }

}
