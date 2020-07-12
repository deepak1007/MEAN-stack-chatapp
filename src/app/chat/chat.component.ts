import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { viewClassName } from '@angular/compiler';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private router : Router, private httpc:HttpClient) { }

  ngOnInit(): void {
   

  }

  goToMessageArea(){
    var spinner = <HTMLElement><any> document.getElementsByClassName('show-spinner')[0];
    spinner.style.display = "block";

    this.httpc.get('http://localhost:8000/room-by-code/XyzaBc1Kzsxsw3').subscribe((res:any)=>{
      if(res.status == true){
        res.data['random'] = 1;
        this.router.navigate(['/chat-dashboard/message-area'],{queryParams:res.data});
        spinner.style.display = "none";
      }
    })
    

    
  }
  
  goToCreateRoom(){
    var spinner = <HTMLElement><any> document.getElementsByClassName('show-spinner')[0];
    spinner.style.display = "block";
    this.router.navigate(['/chat-dashboard/create-room']);
    spinner.style.display  = "none";
  }

  goToSearchRoom(){
    var spinner = <HTMLElement><any> document.getElementsByClassName('show-spinner')[0];
    spinner.style.display = "block";
    this.router.navigate(['/chat-dashboard/search-room']);
    spinner.style.display  = "none";
  }
}
