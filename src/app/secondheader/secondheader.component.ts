import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-secondheader',
  templateUrl: './secondheader.component.html',
  styleUrls: ['./secondheader.component.css']
})
export class SecondheaderComponent implements OnInit {
  loginsignupshowhide;

  @ViewChild('header')
  header:ElementRef;

  constructor(private ds: DataService, private ren: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.loginsignupshowhide = this.ds.authenticationCheck();
  }

  ngAfterViewInit(): void{
    if(window.innerWidth <= 600){
      this.ren.setStyle(this.header, 'display', 'none');
    }
  }

}
