import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  
  }
  
  showsidenav(){
    var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
    if(secondheader.style.display == "none")
    {   
        var nav_btn = <HTMLElement><any> document.getElementsByClassName("nav-show-btn")[0];
        nav_btn.textContent ="X";
        secondheader.style.display = "block";
        
    }
    else{
      var nav_btn = <HTMLElement><any> document.getElementsByClassName("nav-show-btn")[0];
        nav_btn.textContent ="=";
      secondheader.style.display = "none";
    }
  }
}
