import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchrooms',
  templateUrl: './searchrooms.component.html',
  styleUrls: ['./searchrooms.component.css']
})
export class SearchroomsComponent implements OnInit {
  room_list;
  roomCode;
  no = 0;
  constructor(private httpc:HttpClient, private router:Router , private ds:DataService) { }

  ngOnInit(): void {
    this.ds.spinnerControl('show');
    this.httpc.post('http://localhost:8000/get-available-rooms',{all:1, withCode:0}).subscribe((response:any)=>{
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

  search(){
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
  
  
 
}
