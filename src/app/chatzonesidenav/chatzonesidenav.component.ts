import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatzonesidenav',
  templateUrl: './chatzonesidenav.component.html',
  styleUrls: ['./chatzonesidenav.component.css']
})
export class ChatzonesidenavComponent implements OnInit {
  active;

  constructor(private route:Router) {
    this.active = 1
   }

  ngOnInit(): void {
  }

  logout(){
    var confir = confirm("Do you really want to logout?");
    if(confir)
    {
      localStorage.removeItem('email');
      this.route.navigate(['']);
    }
  }
}
