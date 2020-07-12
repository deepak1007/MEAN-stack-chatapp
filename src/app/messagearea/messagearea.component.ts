import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
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
  members = {};
  messageObserver;
  banObserver;

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
  loadingMeme=0;
  random=0;
  membersObserver;


  FullName;



  constructor(private router:Router, private ar:ActivatedRoute, private ds:DataService,private Httpc:HttpClient,  private chatService: ChatServiceService) { }

  ngOnInit(): void {

    this.ds.spinnerControl('show');
    //in file data.service.ts for filling the details object so that we can use the all the informations here
  
    this.chatService.openConnection();
    
 
    this.ar.queryParamMap.subscribe((data:any)=>{

      if(localStorage.getItem('email')){
        this.Httpc.get('http://localhost:8000/get-details/'+localStorage.getItem('email')).subscribe((resp:any)=>{
          if(resp.status == "200")
          {
            this.ds.filldetails(resp.data);
            this.roomDescription = data.get('description');
            this.roomCategory = data.get('category');
            this.roomPassword = data.get('password');
            this.chat_name = data.get('roomName');
            this.mod = data.get('createdBy');
            this.roomPrivacy = data.get('type');
            this.roomCode = data.get('roomCode');
            this.roomPic = data.get('roomPic');
            this.roomMembers = data.get('roomMembers');
            if(data.get('random')==1){
              this.random = 1;
            }
            this.chatService.join_room(this.roomCode, this.ds.details.FullName);//Joins the room and provides user's name function in chat-services.
            this.ds.spinnerControl('hide');

          }
        });
      }
  
    },(err)=>{
      alert("some error has occured please go back and try again");
      this.ds.spinnerControl('hide');
    })
     
    this.messageObserver =  this.chatService.getMessages()
              .subscribe((newIncomingMessage)=>{
                       this.messageList.push(JSON.parse(newIncomingMessage));
   
               });

    this.membersObserver = this.chatService.getMembers().subscribe((response:any)=>{
      this.roomMembers = response.memberCount;
        this.members = response.allMemberDetails;
    })
            
    this.banObserver = this.chatService.removed().subscribe((data:any)=>{
        if(data.ban ==1 ){
          alert("sorry! you were removed by the admin");
          this.router.navigate(['/chat-dashboard/chat']);
        }
    });

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
    this.banObserver.unsubscribe();
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

  isAdmin(){
    if(localStorage.getItem(this.chat_name) == this.getPublicId()){
      return 1;
    }else{
      return 0;
    }
  }
  
  showGroupMenu(e){
    e.preventDefault();
      var menu = <HTMLElement><any>document.getElementsByClassName('menu')[0];
      menu.style.display = 'inline-block';
  }
  hideGroupMenu(){
    var menu = <HTMLElement><any>document.getElementsByClassName('menu')[0];
      menu.style.display = 'none';
  }
  //chat function call from the chat services----------------------->
  removeMember(id){
    this.chatService.removeMember({id:id});
  }

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
      this.chatService.sendMessage({from_id:"anonymous", files:true, details:{name:this.ds.details.FullName, message:this.createMessage, react:{like:0}, meme:{is:0, memeData:""}}});//from id is anonymous .. it will be filled at the server side.
      this.createMessage= '';
     } 
   }

   sendLike(e){
     e.preventDefault();
     this.chatService.sendMessage({from_id:"anonymous", files:true, details:{name:this.ds.details.FullName, message:"", react:{like:1}, meme:{is:0, memeData:""}}});
   }

   sendMeme(e){
     e.preventDefault();
     this.loadingMeme = 1;
     this.Httpc.get("https://meme-api.herokuapp.com/gimme").subscribe((response:any)=>{
       if(response.url != "" && response.nsfw == false){
        this.chatService.sendMessage({from_id:"anonymous",files:true, details:{name:this.ds.details.FullName, message:"",react:"", meme:{is:1, memeData:response}}});
          this.loadingMeme = 0; 
       }
     },(err)=>{
        alert("Sorry, Can't send maymay right now");
        this.loadingMeme = 0;
     })
     
   }

   downloadFile(e, type, src){
     var img = <HTMLElement><any>e.target.parentElement.parentElement.firstElementChild;
     img.setAttribute('src', src );
     e.target.style.display= "none";
   }

}
