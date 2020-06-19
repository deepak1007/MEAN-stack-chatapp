import { Component, OnInit } from '@angular/core';

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
        secondheader.style.display = "block";
        
    }
    else{
      secondheader.style.display = "none";
    }
  }
}
