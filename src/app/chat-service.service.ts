import { Injectable } from '@angular/core';
import { Message } from './message';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  constructor(private clientIO: Socket) { }

  public openConnection(){
    this.clientIO.connect();
  }

  public getMessages = () => {
    return Observable.create((observer) => {
            this.clientIO.on('new-message', (message) => {
                observer.next(message);
            });
    });
  }

  public getMembers =()=>{
    return Observable.create((observer) => {
      this.clientIO.on('new-member', (members) => {
          observer.next(members);
      });
});
  }
  

  public removed = ()=>{
    return Observable.create((observer)=>{
      this.clientIO.on('banned', (data)=>{
        observer.next(data);
      })
    })
  };
  
  public join_room = (room_name, memberName) =>{ //called in messagearea
    this.clientIO.emit('join-room', {room_name:room_name, memberName:memberName, email:localStorage.getItem('email')});
    this.clientIO.on('uniqueIdReceive', (unique_id)=>{//takes the unique id of the socket fills it in local storage.
      localStorage.setItem('uniqueChatId', unique_id.unique_id);//unique id for identification of message belongingness.
      if(unique_id.hasOwnProperty('setAdmin') && unique_id.setAdmin == 1){
        localStorage.setItem(unique_id.group, unique_id.unique_id);
      }
    })
  }
  
  public removeMember(data){
    this.clientIO.emit('member_remove_req', data);
  }
  
  
  

  public sendMessage = (data:Object)=>{
     this.clientIO.emit('create-message',data);
  }

  closeSocket(){
    this.clientIO.disconnect();
  }


}
