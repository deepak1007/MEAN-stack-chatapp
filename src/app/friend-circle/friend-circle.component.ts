import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-friend-circle',
  templateUrl: './friend-circle.component.html',
  styleUrls: ['./friend-circle.component.css']
})

export class FriendCircleComponent implements OnInit, OnDestroy {
  
  showDetails =  false;
  fName;
  fAbout;
  connection_list;
  _currentPage:number = 1;
  get current_page(){
    return isNaN(this._currentPage)?" ": this._currentPage;
 };
 set current_page(x:any){
   x = Number.parseInt(x);
   if(x > this.total_pages){
      this._currentPage = this._currentPage;
   }else{
     this._currentPage = x; 
   }
 }
  
  total_pages = 1;
  max_at_one_page = 4;
  
  getConnectionsUnsubscribe;


  constructor(private httpc:HttpClient, private router:Router , private ds:DataService, private cs: ChatServiceService) { }

  ngOnInit(): void {
    this.ds.spinnerControl('show');

    this.getConnectionsUnsubscribe =  this.httpc.get('http://localhost:8000/get-connection-list/' + localStorage.getItem('email')).subscribe((response:any)=>{
       if(response.status == 200){
              this.connection_list = response.data;
              this.total_pages = Math.floor(this.connection_list.length / this.max_at_one_page + 1);
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


  showDetailsFunction(index){
    this.fName = this.connection_list[index].firstname + " " + this.connection_list[index].lastname;
    this.fAbout = this.connection_list[index].about;
    this.showDetails = true;
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
  
  prevPage(){
    if(this.current_page !=1 ){
       this.current_page--;
    }
  }

  nextPage(){
    if(this.current_page != this.total_pages){
      this.current_page++;
    }
  }

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
