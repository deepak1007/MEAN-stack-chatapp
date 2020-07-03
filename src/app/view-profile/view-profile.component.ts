import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  person_name = "deepak sharma";
  person_about = "this the one and only deepak sharma greatest in the history of history text book";
  person_gender = "male";
  proPic_src = "../../assets/undraw_ideas_s70l.png";
 
  constructor(private httpc: HttpClient, private ar: ActivatedRoute) { }

  ngOnInit(): void {
     
    var spinner = <HTMLElement><any> document.getElementsByClassName('show-spinner')[0];
    spinner.style.display = "block";
    
    var id ;
    this.ar.queryParamMap.subscribe((d:any)=>{
       id = d.get('id');
       console.log(id);
    });

    
      this.httpc.get('http://localhost:8000/view-profile/' + id).subscribe((response:any)=>{
        if(response.status==true){
          this.person_name = response.data.FullName;
          this.person_about = response.data.about;
          this.person_gender = response.data.gender;
          this.proPic_src = response.data.proPic_src?"http://localhost:8000/" + response.data.proPic_src : this.proPic_src;
          spinner.style.display = 'none';
        }else{
          this.person_name = " No user Found ";
          this.person_about = "";
          this.person_gender = "";
          spinner.style.display = 'none';
        }
      },(err)=>{
        this.person_name = " 404 Not Found ";
          this.person_about = "";
          this.person_gender = "";
        spinner.style.display = "none";
      });
  

    
  }
  
  



}
