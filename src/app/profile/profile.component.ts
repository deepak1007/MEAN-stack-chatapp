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

     

    //get the profile pic address saved in the server 
     this.Httpc.get('http://localhost:8000/profile-picture/' + localStorage.getItem('email')).subscribe((res:any)=>{
       if(res.success == true){
         this.proPic_src = "http://localhost:8000/" + res.proPic_src;
       }else{
        this.proPic_src = "..\\..\\assets\\45653808_553438705081091_2716345778523078656_o.png";
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
  { console.log(event);
    this.SelectedProPic = event.target.files[0];
    console.log(this.SelectedProPic);
    var fd = new FormData();
    fd.append("profilePic", this.SelectedProPic, localStorage.getItem('email'));
    this.Httpc.post("http://localhost:8000/upload-profile-picture/"+ localStorage.getItem('email'),fd).subscribe((res:any)=>{
      console.log(res);
      this.proPic_src = res.proPic_src;
    })
    
  }


  savedetails(){
    var data = {password:this.password, gender:this.gender, about:this.about};
    console.log(data);
    this.Httpc.post("http://localhost:8000/save-details/"+ localStorage.getItem('email'),data).subscribe((res:any)=>{
      console.log(res);
    })
  }
  
  cancelChanges(){
    
     this.FullName = this.ds.details.FullName;
     this.email = this.ds.details.email;
     this.password = this.ds.details.password;
     this.about  = this.ds.details.about;
     this.gender = this.ds.details.gender;
    
  }

}
