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
    this.details.about = data.about;
    this.details.gender = data.gender;
    console.log(this.details);
  }   


  detailsFiller(){
    //if details in ds is already filled that is the user has come to the proflepage after login then just get the details to be printed on the profile page
      if(this.details != undefined){
        return this.details;
      }
      //if details in ds is not filled already that is the user has not come directly from login page then get the email from local storage and get the details from database and save it in details
       if(localStorage.getItem('email')){
         this.httpclient.get('http://localhost:8000/get-details/'+localStorage.getItem('email')).subscribe((resp:any)=>{
           if(resp.status == "200")
           {
             this.filldetails(resp.data);
             return this.details;
           }
         });
       }
    
  }

  
  login(data):any{
    
    return this.httpclient.post('http://localhost:8000/login', data);
  }
  
  signup(data):any{
    return this.httpclient.post('http://localhost:8000/sign-up', data);
  }

  verifyAccount(data){
    return this.httpclient.post("http://localhost:8000/verify-account",data);
  }
  
  spinnerControl(display):void{
    var spinner = <HTMLElement><any> document.getElementsByClassName('show-spinner')[0];
    
    if(display == "show"){
       spinner.style.display = "block";
    }else{
      spinner.style.display = "none";
    }
    
  }
  
  createRoomOnServer(data){
    return this.httpclient.post('http://localhost:8000/create-room', data);
  }
  
  saveRoomChangesOnServer(data, roomCode){
    return this.httpclient.post('http://localhost:8000/save-room-changes/' + roomCode,data);
  }

  getRooms(option){
    return this.httpclient.post('http://localhost:8000/get-available-rooms', option);
  }

  authenticationCheck():Boolean{
    if(localStorage.getItem('email')){
      return true;
    }
    else{
      return false;
    }
  }

  
  send_request(connectToId){
    const data  = {
      connectToId : connectToId
    }
    console.log("hello");
    return this.httpclient.post('http://localhost:8000/request-connection/' + localStorage.getItem('email'), data);
  }


}
