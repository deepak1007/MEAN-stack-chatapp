import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-normalpages',
  templateUrl: './normalpages.component.html',
  styleUrls: ['./normalpages.component.css']
})
export class NormalpagesComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
    try{
      if(window.innerWidth <= 600){
        var navbtn = <HTMLElement><any> document.getElementsByClassName('nav-show-btn')[0];
        navbtn.style.display = "flex";
      }
   }catch{

   }
    }
    

}
