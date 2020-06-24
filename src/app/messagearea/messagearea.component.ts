import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messagearea',
  templateUrl: './messagearea.component.html',
  styleUrls: ['./messagearea.component.css']
})
export class MessageareaComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    
    function headershowhide(){
      //if computer view then show side nav and header but for mobile view hide both...
      if(1){
        var header;
         header = <HTMLElement><any> document.getElementsByClassName('header')[0];
        header.style.display =  "none";
       var chat_side_nav;
        chat_side_nav  = <HTMLElement><any> document.getElementsByClassName('chatzonesidenav')[0];
        chat_side_nav.style.display = "none";
      }else{
        
          var header;
           header = <HTMLElement><any> document.getElementsByClassName('header')[0];
          header.style.display =  "block";
         var chat_side_nav;
          chat_side_nav  = <HTMLElement><any> document.getElementsByClassName('chatzonesidenav')[0];
          chat_side_nav.style.display = "flex";
      }
    }

    headershowhide();
 /*   window.onresize = function(){
       headershowhide();
    }*/

 

  }
  performExit(){
    var header;
    header = <HTMLElement><any> document.getElementsByClassName('header')[0];
    header.style.display =  "block";
    var chat_side_nav;
    chat_side_nav  = <HTMLElement><any> document.getElementsByClassName('chatzonesidenav')[0];
    chat_side_nav.style.display = "flex";
    this.router.navigate(['/chat-dashboard/chat']);

  }

}
