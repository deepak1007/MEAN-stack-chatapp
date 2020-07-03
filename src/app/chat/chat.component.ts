import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
   

  }

  goToMessageArea(){
    var spinner = <HTMLElement><any> document.getElementsByClassName('show-spinner')[0];
    spinner.style.display = "block";
    this.router.navigate(['/chat-dashboard/message-area']);
    spinner.style.display  = "none";
  }

}
