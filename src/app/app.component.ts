import { Component, Renderer2 } from '@angular/core';
import { StateService } from './state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatapp';
  constructor(private ren:Renderer2, private ss: StateService){}
  ngOnInit(): void {
    var spinner = <HTMLElement><any> document.getElementsByClassName('show-spinner')[0];
    spinner.style.display = 'block';
    
    this.ss.returnMNA().subscribe((data: any)=>{
      this.notif("info", "new message from " + data.name);
    })

    window.onresize= function(){
      try{
        
        if(window.innerWidth >= 600)
        {  var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
          secondheader.style.display = "block";
        }
        else{
          var secondheader =  <HTMLElement><any> document.getElementsByClassName("second-header")[0];
          secondheader.style.display = "none";
        }

      }catch{

      }
    
    }
    spinner.style.display = "none";
  }
  

  notif(type, message){
    const div = this.ren.createElement('div');
    this.ren.addClass(div, 'alert');
    this.ren.setAttribute(div, 'role', 'alert');
    const strong = this.ren.createElement('strong');
    this.ren.appendChild(strong, this.ren.createText(message));
    this.ren.appendChild(div, strong);
    let container = <HTMLElement><any> document.getElementsByClassName('container-fluid');
    container = container[0];
     if(type == 'info'){
      this.ren.addClass(div, "alert-info");
     }else if(type == 'success'){
      this.ren.addClass(div, "alert-success");
     }else if(type == 'failed'){
       this.ren.addClass(div, "alert-danger");
     }else{
       this.ren.addClass(div, "alert-warning");
     }

     this.ren.appendChild(container, div);
   }

}
