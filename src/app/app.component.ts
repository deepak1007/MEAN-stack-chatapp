import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatapp';

  ngOnInit(): void {
    

    window.onresize= function(){
      if(window.innerWidth >= 600)
      {  var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
        secondheader.style.display = "block";
      }
      else{
        var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
        secondheader.style.display = "none";
      }
    }
  }
  
}
