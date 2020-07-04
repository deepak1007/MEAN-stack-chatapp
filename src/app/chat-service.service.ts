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
    this.clientIO.disconnect();
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
  
  public join_room = (room_name) =>{
    this.clientIO.emit('join-room', {room_name:room_name, email:localStorage.getItem('email')});
    this.clientIO.on('uniqueIdReceive', (unique_id)=>{//takes the unique id of the socket fills it in local storage.
       localStorage.setItem('uniqueChatId', unique_id.unique_id);//unique id for identification of message belongingness.
    })
  }

  
  

  public sendMessage = (data:Object)=>{
     this.clientIO.emit('create-message',data);
  }

  closeSocket(){
    this.clientIO.disconnect();
  }


}
