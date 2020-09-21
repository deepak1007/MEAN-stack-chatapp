import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatServiceService } from '../chat-service.service';
import { StateService } from '../state.service';


@Component({
  selector: 'app-chatzonesidenav',
  templateUrl: './chatzonesidenav.component.html',
  styleUrls: ['./chatzonesidenav.component.css']
})
export class ChatzonesidenavComponent implements OnInit {
  active;
  newMessage = false;
  colorselected = ["black", "black", "black"];

  constructor(private route:Router, private cs: ChatServiceService, private ss:StateService) {
    this.active = 1
   }

  ngOnInit(): void {
     
     this.cs.messageNotif().subscribe(()=>{
       this.newMessage = true;
     });
     
     this.ss.returnMIO().subscribe((data: any)=>{
       if(data.seen){
         this.newMessage = false;
       }
     })
     

  }
  changecolor(i){
     for(var j=0; j< this.colorselected.length ; j++){
       this.colorselected[j] = "black";
     }
     this.colorselected[i] = "green";
  }

  /*changebg(th){
    var all_li ;
     all_li = <HTMLElement><any> document.getElementsByClassName('flex-item');
    if(window.innerWidth >= 601){
       for(var j=0 ; j< all_li.length ; j++){
        all_li[j].style.background = "whitesmoke";
      }
       th =  <HTMLElement><any> th;
       th.style.background = "white";
    }
  }*/
  
  logout(){
    var confir = confirm("Do you really want to logout?");
    if(confir)
    {
      localStorage.removeItem('email');
      this.route.navigate(['']);
    }
  }
}
