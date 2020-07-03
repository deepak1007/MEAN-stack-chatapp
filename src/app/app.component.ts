import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatapp';

  ngOnInit(): void {
    var spinner = <HTMLElement><any> document.getElementsByClassName('show-spinner')[0];
    spinner.style.display = 'block';
    

    window.onresize= function(){
      try{
        
        if(window.innerWidth >= 600)
        {  var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
          secondheader.style.display = "block";
          var nav_btn = <HTMLElement><any> document.getElementsByClassName("nav-show-btn")[0];
          nav_btn.style.display = "none";
        }
        else{
          var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
          secondheader.style.display = "none";
          var nav_btn = <HTMLElement><any> document.getElementsByClassName("nav-show-btn")[0];
          nav_btn.style.display="block";
        }

      }catch{

      }
    
    }
    spinner.style.display = "none";
  }
  

}
