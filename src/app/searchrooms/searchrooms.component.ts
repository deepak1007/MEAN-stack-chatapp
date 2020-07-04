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
    this.httpc.get('http://localhost:8000/room-by-code/'+code).subscribe((res:any)=>{
      if(res.status == true){
       
        this.router.navigate(['/chat-dashboard/message-area'],{queryParams:res.data});
        this.ds.spinnerControl('hide');
      }
    })
  }
  
 
}
