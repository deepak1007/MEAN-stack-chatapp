import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  scroll_string_to_no = {
    "0px"   : 0,
    "100%" : 100,
    "200%" : 200,
    "300%" : 300,
    "50%" : 50,
    "150%" :150,
    "250%" : 250,
   // "400%" : 400,
  //  "-400%" : -400,
    "-300%" : -300,
    "-200%" : -200,
    "-100%" : -100,
    "-250%" : -250,
    "-150%" : -150,
    "-50%"  : -50,
  };

  scroll_no_to_string: any = {
     0   : "0",
     100 : "100%",
     200 : "200%",
     300 : "300%", 
     50 : "50%",
     150 :"150%",
     250 : "250%",
   //  400 : "400%",
   // "-400" : "-400%",
    "-300" : "-300%",
    "-200" : "-200%",
    "-100" : "-100%",
    "-250" : "-250%",
    "-150" : "-150%",
    "-50"  : "-50%",
  };

  inner:any;
  style:any;
  left_arrow;
  right_arrow;
  constructor(private ds:DataService) { }

  ngOnInit(): void {
    this.ds.spinnerControl('show');

    
    if(window.innerWidth <=600){
      var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
      secondheader.style.display = "none";
      var nav_show_btn =  <HTMLElement><any> document.getElementsByClassName("nav-show-btn")[0];
      nav_show_btn.textContent = "=";
    }

    //for animation 
    this.inner = <HTMLElement><any> document.getElementById('animate');
    this.inner.style.left = "0px";
    this.left_arrow = <HTMLElement><any> document.getElementsByClassName('scroll-notify-left')[0];
    this.left_arrow.style.display = "none";
    this.right_arrow =<HTMLElement><any> document.getElementsByClassName('scroll-notify-right')[0];
     window.addEventListener('wheel', (e)=>{
     if(window.innerWidth > 600){
     if(e.deltaY < 0){
       if(this.inner.style.left != "0px"){
        var current_position_left = this.scroll_string_to_no[this.inner.style.left];
        this.inner.style.left = this.scroll_no_to_string[current_position_left + 100]; 
        this.left_arrow.style.display = "inline-block";
        this.right_arrow.style.display = "inline-block";
       }
       if(this.inner.style.left == "0px"){
        this.right_arrow.style.display = "inline-block";
        this.left_arrow.style.display = "none";
       }
     }else if(e.deltaY > 0){
       if(this.inner.style.left != "-300%"){
        var current_position_left = this.scroll_string_to_no[this.inner.style.left];
        this.inner.style.left = this.scroll_no_to_string[current_position_left - 100];
        this.right_arrow.style.display = "inline-block";
        this.left_arrow.style.display = "inline-block";
       }
       if(this.inner.style.left == "-300%"){
        this.right_arrow.style.display = "none";
        this.left_arrow.style.display = "inline-block";
       }

     }
    }
  });

//animation of home over

  this.ds.spinnerControl('hide');
  }

  
 

}
