import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-secondheader',
  templateUrl: './secondheader.component.html',
  styleUrls: ['./secondheader.component.css']
})
export class SecondheaderComponent implements OnInit {
  loginsignupshowhide;
  constructor(private ds: DataService) { }

  ngOnInit(): void {
    if(window.innerWidth <=600){
      var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
      secondheader.style.display = "none"
    }
    this.loginsignupshowhide = this.ds.authenticationCheck();
  }

}
