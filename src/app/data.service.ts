import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpclient: HttpClient) { }
  
  login(data):any{
    
    return this.httpclient.post('http://localhost:8000/login', data);
  }
  
  signup(data):any{
    return this.httpclient.post('http://localhost:8000/sign-up', data);
  }

}
