import { Injectable } from '@angular/core';
import { Message } from './message';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  constructor(private clientIO: Socket) { }

  public getMessages = () => {
    return Observable.create((observer) => {
            this.clientIO.on('new-message', (message) => {
                observer.next(message);
            });
    });
  }

  public sendMessage = (data:Object)=>{
     this.clientIO.emit('create-message',data);
  }

  closeSocket(){
    this.clientIO.disconnect();
  }


}
