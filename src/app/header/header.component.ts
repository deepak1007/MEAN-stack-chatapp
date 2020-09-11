import { Component, OnInit, Input,HostListener, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  toggle:Boolean = false;
  @ViewChild('nav_btn')
  nav_btn: ElementRef;

  @HostListener('window:resize')
  checkWindowSize(e){
    if(window.innerWidth > 600){
     this.ren.setStyle(this.nav_btn.nativeElement, 'display', 'none');
    }else{
      this.toggle = false;
      this.ren.setStyle(this.nav_btn.nativeElement, 'display', 'flex')
    }
  }

  
  constructor(private ren:Renderer2 , private el: ElementRef) { }

  ngOnInit(): void {
  
  }
  
  showsidenav(){
    var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
    if(secondheader.style.display == "none")
    {   
        this.toggle = !this.toggle;
        secondheader.style.display = "block";
        
    }
    else{
      this.toggle = !this.toggle;
      secondheader.style.display = "none";
    }
  }
}
