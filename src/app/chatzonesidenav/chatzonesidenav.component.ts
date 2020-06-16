import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatzonesidenav',
  templateUrl: './chatzonesidenav.component.html',
  styleUrls: ['./chatzonesidenav.component.css']
})
export class ChatzonesidenavComponent implements OnInit {
  active;
  constructor() {
    this.active = 1
   }

  ngOnInit(): void {
  }

}
