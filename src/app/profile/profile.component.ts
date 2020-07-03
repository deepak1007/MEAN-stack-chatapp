import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  FullName;
  email;
  password;
  about="";
  gender='';
  gender_value;
  SelectedProPic;
  proPic_src;


  constructor( private ds : DataService, private Httpc: HttpClient) { }

  ngOnInit(): void {

    this.ds.spinnerControl('show');
    var job_done_counter = 0;
    //get the profile pic address saved in the server 
     this.Httpc.get('http://localhost:8000/profile-picture/' + localStorage.getItem('email')).subscribe((res:any)=>{
       if(res.success == true){
         this.proPic_src = "http://localhost:8000/" + res.proPic_src;
          job_done_counter = job_done_counter  + 1;
          if(job_done_counter == 2){
            this.ds.spinnerControl('hide');
          }
       }else{
        this.proPic_src = "..\\..\\assets\\45653808_553438705081091_2716345778523078656_o.png";
        job_done_counter = job_done_counter  + 1;
        if(job_done_counter == 2){
          this.ds.spinnerControl('hide');
        }
       }
     });


   
    //if details in ds is already filled that is the user has come to the proflepage after login then just get the details to be printed on the profile page
    /*if(this.ds.details != undefined)
   { this.FullName = this.ds.details.FullName;
    this.email = this.ds.details.email;
    this.password = this.ds.details.password;
    this.about  = this.ds.details.about;
    this.gender = this.ds.details.gender;
   }
   else{*/
     //if details in ds is not filled already that is the user has not come directly from login page then get the email from local storage and get the details from database and save it in details
      if(localStorage.getItem('email')){
        this.Httpc.get('http://localhost:8000/get-details/'+localStorage.getItem('email')).subscribe((resp:any)=>{
          if(resp.status == "200")
          {
            this.ds.filldetails(resp.data);
            this.FullName = resp.data.FullName;
            this.email = resp.data.email;
            this.password = resp.data.password;
            this.about = resp.data.about;
            this.gender = resp.data.gender;
            job_done_counter = job_done_counter  + 1;
            if(job_done_counter == 2){
               this.ds.spinnerControl('hide');
            }
          }else{
            job_done_counter = job_done_counter  + 1;//if the  request of both subscriber is complete then hide the spinner. 
            if(job_done_counter == 2){
              this.ds.spinnerControl('hide');
            }
          }
        });
      }
  // }

  

  }

  
  
  changeGender(e){
    this.gender = e.target.options[e.target.selectedIndex].value;
    console.log(this.gender);
  }

  fileSelectAndUpload(event)
  { this.ds.spinnerControl('show');

    this.SelectedProPic = event.target.files[0];
    console.log(this.SelectedProPic);
    var fd = new FormData();
    fd.append("profilePic", this.SelectedProPic, localStorage.getItem('email'));
    this.Httpc.post("http://localhost:8000/upload-profile-picture/"+ localStorage.getItem('email'),fd).subscribe((res:any)=>{
      this.proPic_src = res.proPic_src;
      this.ds.spinnerControl('hide');
    });
    
  }


  savedetails(){
    this.ds.spinnerControl('show');
    var data = {password:this.password, gender:this.gender, about:this.about};
    console.log(data);
    this.Httpc.post("http://localhost:8000/save-details/"+ localStorage.getItem('email'),data).subscribe((res:any)=>{
      
       this.ds.spinnerControl('hide');
       alert("details has been saved");

    });
  }
  
  cancelChanges(){
    
     this.FullName = this.ds.details.FullName;
     this.email = this.ds.details.email;
     this.password = this.ds.details.password;
     this.about  = this.ds.details.about;
     this.gender = this.ds.details.gender;
    
  }

}
