import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-createroom',
  templateUrl: './createroom.component.html',
  styleUrls: ['./createroom.component.css']
})
export class CreateroomComponent implements OnInit {
   roomName;
   roomPass;
   roomDescription;
   roomCat;
   SelectedRoomPic;
   roomPic_src;
   privacy = 'public';
  constructor(private ds: DataService, private router: Router, private httpc: HttpClient ) { }

  ngOnInit(): void {
      this.ds.spinnerControl('show');
      this.ds.spinnerControl('hide');

  }
  
  changePrivacy(e){
    this.privacy = e.target.options[e.target.selectedIndex].value;
  }
  
  create_room(){
    this.ds.spinnerControl('show');
    var data = {creator:localStorage.getItem('email'),roomName:this.roomName, roomDescription:this.roomDescription, roomCategory:this.roomCat, roomPassword:this.roomPass, roomPrivacy:this.privacy, roomPic:this.roomPic_src||"../../assets/45653808_553438705081091_2716345778523078656_o.png",roomMembers:0, memberDetails:{}};
    this.ds.createRoomOnServer(data).subscribe((response:any)=>{
      if(response.status==true){
        data = response.data;
      
        this.ds.spinnerControl('close');
        alert('room has been created');
        data['random'] = 0;
        this.router.navigate(['/chat-dashboard/message-area'],{queryParams:data});  
      }
      else{
        this.ds.spinnerControl('hide');
        alert("sorry some error occured, Room was not created");
        
      }
      
    },(err)=>{
      this.ds.spinnerControl('hide');
      alert("Not Found");
    });
  }

  fileSelectAndUpload(event)
{ this.ds.spinnerControl('show');

  this.SelectedRoomPic = event.target.files[0];
  var fd = new FormData();
  fd.append("profilePic", this.SelectedRoomPic, localStorage.getItem('email'));
  this.httpc.post("http://localhost:8000/room_pictures/room/"+ localStorage.getItem('email'),fd).subscribe((res:any)=>{ console.log(res);
    if(res.success == true){
    this.roomPic_src = res.roomPic_src;
    this.ds.spinnerControl('hide');
  }else{
    this.ds.spinnerControl('hide');
    alert('sorry some error occurred');
  }
    
  });

}


}