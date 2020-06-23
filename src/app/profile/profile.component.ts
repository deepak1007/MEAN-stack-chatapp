import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  FullName;
  email;
  password;
  about = "this is me bro!"; //demo text for about section
  constructor( private ds : DataService, private Httpc: HttpClient) { }

  ngOnInit(): void {
    //if details in ds is already filled that is the user has come to the proflepage after login then just get the details to be printed on the profile page
    if(this.ds.details != undefined)
   { this.FullName = this.ds.details.FullName;
    this.email = this.ds.details.email;
    this.password = this.ds.details.password;
   }
   else{
     //if details in ds is not filled already that is the user has not come directly from login page then get the email from local storage and get the details from database and save it in details
      if(localStorage.getItem('email')){
        this.Httpc.get('http://localhost:8000/get-details/'+localStorage.getItem('email')).subscribe((resp:any)=>{
          if(resp.status == "200")
          {
            this.ds.filldetails(resp.data);
            this.FullName = resp.data.FullName;
            this.email = resp.data.email;
            this.password = resp.data.password;
          }
        });
      }
   }
  }
  

}
