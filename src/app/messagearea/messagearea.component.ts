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
  showModal = false;
  roomPasswordCheck=null;
  urlParams;

  createMessage:string;
  messageList = [];
  members = {};
  messageObserver;
  banObserver;
  SelectedRoomPic;

  chat_name;
  mod;
  roomCode;
  roomPassword;
  roomDescription;
  roomCategory;
  roomPrivacy;
  roomPic;
  roomMembers;
  roomPass
  group=1;
  loadingMeme=0;
  random=0;
  membersObserver;
  rejectionObserver;

  FullName;



  constructor(private router:Router, private ar:ActivatedRoute, private ds:DataService,private Httpc:HttpClient,  private chatService: ChatServiceService) { }

  ngOnInit(): void {

    this.ds.spinnerControl('show');
    /* in file data.service.ts for filling the details object so that we can use the all the informations here */
  
    this.chatService.openConnection();
    
    /* takes url params matches the room type, if room type is private it opens password modal else it just calls  room join procedure function. */
    this.ar.queryParams.subscribe((data:any)=>{
      this.urlParams = data;
      if(data.roomType== 'private' || data.type == 'private'){
        this.showModal = true;
        this.ds.spinnerControl('hide');
      }else{
        this.join_room_procedure();
      }   
    },(err)=>{
      alert("some error has occured please go back and try again");
      this.ds.spinnerControl('hide');
    });
    
     
    this.messageObserver =  this.chatService.getMessages()
              .subscribe((newIncomingMessage: any)=>{
                       this.messageList.push(JSON.parse(newIncomingMessage));
               });

    this.membersObserver = this.chatService.getMembers().subscribe((response:any)=>{
      this.roomMembers = response.memberCount;
        this.members = response.allMemberDetails;
    })


    this.rejectionObserver = this.chatService.rejected().subscribe((data:any)=>{
      alert(data.message);
      this.router.navigate(['/chat-dashboard/chat']);
    })
            
    this.banObserver = this.chatService.removed().subscribe((data:any)=>{
        if(data.ban ==1 ){
          alert("sorry! you were removed by the admin");
          this.router.navigate(['/chat-dashboard/chat']);
        }
    });
     

    function headershowhide(){
      /* if computer view then show side nav and header but for mobile view hide both... */
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
    /* 
    window.onresize = function(){
       headershowhide();
    }
    */
    }
  

  join_room_with_password(){
    /*
     * this is called when the room is password protected and user submits the password.
     */
    this.showModal = false;
    this.ds.spinnerControl('show');
    this.join_room_procedure();
  }

  join_room_procedure(){
     /*
      * It takes the url params and then fills the details of the room in service and then joins the room
      * if the room is password protected it has to be called through enter_room_with_password() function
      * if not then we can directly call it through ngOnInit();
      * 
      */   
     if(localStorage.getItem('email')){
      this.Httpc.get('http://localhost:8000/get-details/'+localStorage.getItem('email')).subscribe((resp:any)=>{
        if(resp.status == "200")
        {  
           this.ds.filldetails(resp.data);
           console.log(this.urlParams.roomCode);
           this.Httpc.get('http://localhost:8000/room-by-code/'+ this.urlParams.roomCode).subscribe((res:any)=>{
            if(res.status == true){
                this.roomDescription = res.data['description'];
                this.roomCategory = res.data['category'];
                this.roomPassword = res.data['password'];
                this.chat_name = res.data['roomName'];
                this.mod = res.data['createdBy'];
                this.roomPrivacy = res.data['type'];
                this.roomCode = res.data['roomCode'];
                this.roomPic = res.data['roomPic'];
                this.roomMembers = res.data['roomMembers'];
                this.random = this.urlParams.random;
                this.chatService.join_room(this.roomCode, this.ds.details.FullName, this.roomPasswordCheck); 
            }else{
              console.log(res.message);
            }
           },(err)=>{
            console.log(err);
            this.ds.spinnerControl('hide');
           },()=>{
            console.log("completed");
            this.ds.spinnerControl('hide');
           });
          //Joins the room and provides user's name function in chat-services.
          this.ds.spinnerControl('hide');
        }
      });
    }  
  }
   
  ngOnDestroy(): void {
    var spinner = <HTMLElement><any> document.getElementsByClassName('show-spinner')[0];
    spinner.style.display = "block";
    this.messageObserver.unsubscribe();
    this.membersObserver.unsubscribe();
    this.rejectionObserver.unsubscribe();
    this.banObserver.unsubscribe();
    /*
     * this.chatService.closeSocket();
     * closes the entire connection that is makes the user offline. (experimental) we are using
     * closeChat instead that just makes performs the chat exit.
     * remove the close chat if not working properly.
     * 
     */
    this.chatService.closeChat();
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

  isAdmin(){
    if(localStorage.getItem(this.chat_name) == this.getPublicId()){
      return 1;
    }else{
      return 0;
    }
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

   fileSelectAndUpload(event)
    { 
      this.ds.spinnerControl('show');
      this.SelectedRoomPic = event.target.files[0];
      var fd = new FormData();
      fd.append("profilePic", this.SelectedRoomPic, localStorage.getItem('email'));
      this.Httpc.post("http://localhost:8000/room_pictures/room/"+ localStorage.getItem('email'),fd).subscribe((res:any)=>{    console.log(res);
        if(res.success == true){
        this.roomPic = res.roomPic_src;
        this.ds.spinnerControl('hide');
      }else{
        this.ds.spinnerControl('hide');
        alert('sorry some error occurred');
      }
     
   });
  }

  changePrivacy(e){
    this.roomPrivacy = e.target.options[e.target.selectedIndex].value;
  }

  save_room_changes(){
    this.ds.spinnerControl('show');
    var data = {
      creator:localStorage.getItem('email'),
      roomName:this.chat_name,
      roomDescription:this.roomDescription, 
      roomCategory:this.roomCategory, 
      roomPassword:this.roomPassword, 
      roomPrivacy:this.roomPrivacy, 
      roomPic:this.roomPic||"../../assets/45653808_553438705081091_2716345778523078656_o.png",
      roomMembers:this.roomMembers, 
    };
    this.ds.saveRoomChangesOnServer(data, this.roomCode).subscribe((resp:any)=>{
      if(resp.status==true){
        let data = resp.data;
        this.roomDescription = data.description;
        this.roomCategory = data.category;
        this.roomPassword = data.password
        this.chat_name = data.roomName;
        this.roomPrivacy = data.type;
        this.roomPic = data.roomPic;
      
        this.ds.spinnerControl('close');
        //alert('room has been created');
        //data['random'] = 0;
        //this.router.navigate(['/chat-dashboard/message-area'],/{queryParams:data});  
      }
      else{
        this.ds.spinnerControl('hide');
        alert("sorry some error occured, Room was not created");
        
      }
      
    },(err)=>{
      this.ds.spinnerControl('hide');
      alert("Not Found");
    });
  }

}
