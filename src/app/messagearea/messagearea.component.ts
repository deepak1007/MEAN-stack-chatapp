import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ChatServiceService } from '../chat-service.service';
import { DataService } from '../data.service';
import { HttpClient } from "@angular/common/http";

import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-messagearea',
  templateUrl: './messagearea.component.html',
  styleUrls: ['./messagearea.component.css']
})
export class MessageareaComponent implements OnInit {
  createMessage:string;
  messageList = [];
  messageObserver;

  chat_name;
  mod;
  roomCode;
  roomPassword;
  roomDescription;
  roomCategory;
  roomPrivacy;
  roomPic;
  roomMembers
  group=1;

  membersObserver;


  FullName;



  constructor(private router:Router, private ar:ActivatedRoute, private ds:DataService,private Httpc:HttpClient,  private chatService: ChatServiceService) { }

  ngOnInit(): void {

    this.ds.spinnerControl('show');
    
    this.chatService.openConnection();
    
    
    this.ar.queryParamMap.subscribe((data:any)=>{
      this.roomDescription = data.get('description');
      this.roomCategory = data.get('category');
      this.roomPassword = data.get('password');
      this.chat_name = data.get('roomName');
      this.mod = data.get('createdBy');
      this.roomPrivacy = data.get('type');
      this.roomCode = data.get('roomCode');
      this.roomPic = data.get('roomPic');
      this.roomMembers = data.get('roomMembers');
      this.chatService.join_room(this.roomCode);
      this.ds.spinnerControl('hide');
    })
     
    this.messageObserver =  this.chatService.getMessages()
              .subscribe((newIncomingMessage)=>{
                       this.messageList.push(JSON.parse(newIncomingMessage));
   
               });

    this.membersObserver = this.chatService.getMembers().subscribe((members)=>{
      this.roomMembers = members;
    })
            
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
   
  ngOnDestroy(): void {
    var spinner = <HTMLElement><any> document.getElementsByClassName('show-spinner')[0];
    spinner.style.display = "block";

    this.messageObserver.unsubscribe();
    this.membersObserver.unsubscribe();
    this.chatService.closeSocket();
    var header;
    header = <HTMLElement><any> document.getElementsByClassName('header')[0];
    header.style.display =  "block";
    var chat_side_nav;
    chat_side_nav  = <HTMLElement><any> document.getElementsByClassName('chatzonesidenav')[0];
    chat_side_nav.style.display = "flex";

    spinner.style.display = "none";
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
    return localStorage.getItem('uniqueChatId');//check whether the message belongs to self or to others
  }

  scrollToBottom(){
       var chat_messages = <HTMLElement><any>document.getElementsByClassName('chat-messages')[0];
       chat_messages.scrollTop = chat_messages.scrollHeight;
       //chat_messages.scrollTop = chat_messages.scrollHeight - chat_messages.clientHeight;
       return false;
  }

  viewProfile(id){
    this.router.navigate(['/chat-dashboard/view-profile'], {queryParams: {id : id}});
  }
  
  showGroupMenu(){

  }
  //chat function call from the chat services----------------------->

  checkIfEnter(e){
    var e = e || window.event;
    var charcode = e.keyCode || e.which;
    
    if(charcode == 13){
      e.preventDefault();
      this.sendMessage();
    }else{
    }
  }

   sendMessage(){
     if(this.createMessage != ""){
      this.chatService.sendMessage({from_id:"anonymous", details:{name:this.ds.details.FullName, message:this.createMessage, react:{like:0}}});//from id is anonymous .. it will be filled at the server side.
      this.createMessage= '';
     } 
   }

   sendLike(e){
     e.preventDefault();
     this.chatService.sendMessage({from_id:"anonymous", details:{name:this.ds.details.FullName, message:"", react:{like:1}}});
   }

}
