import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatServiceService } from '../chat-service.service';
import { DataService } from '../data.service';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-messagearea',
  templateUrl: './messagearea.component.html',
  styleUrls: ['./messagearea.component.css']
})
export class MessageareaComponent implements OnInit {
  createMessage:string;
  messageList = [];
  messageObserver;
  group=1;


  FullName;


  constructor(private router:Router,private ds:DataService,private Httpc:HttpClient,  private chatService: ChatServiceService) { }

  ngOnInit(): void {
     
    this.messageObserver =  this.chatService.getMessages()
              .subscribe((newIncomingMessage)=>{
                       this.messageList.push(JSON.parse(newIncomingMessage));;
               });
    
               
    this.ds.detailsFiller(); //in file data.service.ts for filling the details object so that we can use the all the informations here

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
     this.messageObserver.unsubscribe();

    var header;
    header = <HTMLElement><any> document.getElementsByClassName('header')[0];
    header.style.display =  "block";
    var chat_side_nav;
    chat_side_nav  = <HTMLElement><any> document.getElementsByClassName('chatzonesidenav')[0];
    chat_side_nav.style.display = "flex";
    this.router.navigate(['/chat-dashboard/chat']);
  }

  getPublicId(){
    return this.ds.details.public_id;
  }



  //chat function call from the chat services----------------------->

   sendMessage(){
    
     this.chatService.sendMessage({from_id:this.ds.details.public_id, details:{name:this.ds.details.FullName, message:this.createMessage, react:{like:0}}});
     this.createMessage= '';
   }

   sendLike(e){
     e.preventDefault();
     this.chatService.sendMessage({from_id:this.ds.details.public_id, details:{name:this.ds.details.FullName, message:"", react:{like:1}}})
   }

}
