import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  fullName;
  userEmail;
  phone;
  userQuery;
  constructor(private httpc: HttpClient, private ds: DataService) { }

  ngOnInit(): void {
    this.ds.spinnerControl('show');
     //shows nav-show-btn in header only when visiting normal pages and if the window width is less then 600px and hides the second header when any nav button is clicked;
     if(window.innerWidth <=600){
      var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
      secondheader.style.display = "none";
      var nav_show_btn =  <HTMLElement><any> document.getElementsByClassName("nav-show-btn")[0];
      nav_show_btn.textContent = "=";
    }
    //----------------------
    
    this.ds.spinnerControl('hide');
  }

  sendQuery(){
    this.ds.spinnerControl('show');
    
    var data = {fullName:this.fullName, userEmail:this.userEmail, phone:this.phone, userQuery:this.userQuery};
    this.httpc.post("http://localhost:8000/query", data).subscribe((response:any)=>{
      if(response.status==true){
        alert("Query has been submitted");
        this.fullName = "";
        this.userQuery = "";
        this.userEmail ="";
        this.phone = "";
        this.ds.spinnerControl('hide');
      }else{
        this.ds.spinnerControl('hide');
        alert("Sorry Query was not submitted, Please try again");
      }
    });
  }

}
