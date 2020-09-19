import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-chatzone',
  templateUrl: './chatzone.component.html',
  styleUrls: ['./chatzone.component.css']
})
export class ChatzoneComponent implements OnInit {

  constructor(private cs: ChatServiceService) {
        
   }

  ngOnInit(): void {
      
    var navbtn = <HTMLElement><any> document.getElementsByClassName('nav-show-btn')[0];
    navbtn.style.display = "none";
    
    this.cs.getOnline();
  
  }

}
