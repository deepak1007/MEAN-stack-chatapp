import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit, OnDestroy {

  request_list;
  getRequestUnsubscribe
  constructor(private httpc:HttpClient, private router:Router , private ds:DataService) { }

  ngOnInit(): void {
    this.ds.spinnerControl('show');
    this.getRequestUnsubscribe =this.httpc.get('http://localhost:8000/get-requests-list/' + localStorage.getItem('email')).subscribe((response:any)=>{
       if(response.status == 200){
              this.request_list = response.data;
              this.ds.spinnerControl('hide');
       }else{
        this.request_list = [];
        this.ds.spinnerControl('hide');
       }
    }, (err)=>{
      this.request_list = [];
       this.ds.spinnerControl('hide');
       alert("some error occured 1");
    });
  }
  
  acceptRequest(index, userId){
    this.httpc.post('http://localhost:8000/add-friend/' + localStorage.getItem('email'), {connectToId: userId, ownId: localStorage.getItem('userUniqueId')}).subscribe((response:any)=>{
      if(response.status == 200){
             this.request_list.splice(index, 1);
             this.ds.spinnerControl('hide');
      }else{
       this.ds.spinnerControl('hide');
      }
   }, (err)=>{
      this.ds.spinnerControl('hide');
      alert("some error occured");
   });

  }

    ngOnDestroy(): void {
    this.getRequestUnsubscribe.unsubscribe();
  }
  /*search(){
  //search codes
  this.httpc.post('http://localhost:8000/get-available-rooms',{all:0, withCode:1, roomCode: this.roomCode}).subscribe((response:any)=>{
    if(response.status == true){
           this.room_list = response.data;
           console.log(this.room_list);
           this.ds.spinnerControl('hide');
    }else{
      this.room_list = [];
     this.ds.spinnerControl('hide');
     alert('no rooms found');
    }
 }, (err)=>{
   this.room_list = [];
    this.ds.spinnerControl('hide');
    alert("some error occured");
 });
  }


  goToRoom(code){
      this.ds.spinnerControl('show');
      const data = {};
      data['roomCode'] = code;
      if(code == 'XyzaBc1Kzsxsw3'){
        data['random'] = 1;
      }else{
        data['random'] = 0;
      }
      this.router.navigate(['/chat-dashboard/message-area'],{queryParams:data});
      this.ds.spinnerControl('hide'); 
      }
  
  */

  goToProfile(userId){
    this.router.navigate(['/chat-dashboard/view-profile'], {queryParams: {id : null, userDbId: userId}});
  }
}
