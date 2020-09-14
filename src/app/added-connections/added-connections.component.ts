import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-added-connections',
  templateUrl: './added-connections.component.html',
  styleUrls: ['./added-connections.component.css']
})
export class AddedConnectionsComponent implements OnInit, OnDestroy {

  connection_list;
  getConnectionsUnsubscribe

  constructor(private httpc:HttpClient, private router:Router , private ds:DataService, private cs: ChatServiceService) { }

  ngOnInit(): void {
    this.ds.spinnerControl('show');
    this.getConnectionsUnsubscribe =  this.httpc.get('http://localhost:8000/get-connection-list/' + localStorage.getItem('email')).subscribe((response:any)=>{
       if(response.status == 200){
              this.connection_list = response.data;
              this.ds.spinnerControl('hide');
       }else{
        this.connection_list = [];
        this.ds.spinnerControl('hide');
       }
    }, (err)=>{
      this.connection_list = [];
       this.ds.spinnerControl('hide');
       alert("some error occured 1");
    });

   
  }
  
  removeConnection(index, userId){
    this.httpc.post('http://localhost:8000/remove-friend/' + localStorage.getItem('email'), {connectToId: userId}).subscribe((response:any)=>{
      if(response.status == 200){
             this.connection_list.splice(index, 1);
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
    this.getConnectionsUnsubscribe.unsubscribe();
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

  message(userId){
    this.ds.spinnerControl('show');
    const data = {};
    data['roomCode'] = userId;
    data['random'] = 0;
    
    this.router.navigate(['/chat-dashboard/private-chat'],{queryParams:data});
    this.ds.spinnerControl('hide'); 
  }

  goToProfile(userId){
    this.router.navigate(['/chat-dashboard/view-profile'], {queryParams: {id : null, userDbId: userId}});
  }

  

}
