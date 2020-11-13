import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }
  
  messageIndicatorObserver$ = new Subject();
  
  public returnMIO(){
    return this.messageIndicatorObserver$.asObservable();
  }

  public messageSeen(){
    this.messageIndicatorObserver$.next({seen: true});
  }
  
  messageNotificationAlert$ = new Subject();
  public returnMNA(){
    return this.messageNotificationAlert$.asObservable();
  }
  public showNotif(data){
    this.messageNotificationAlert$.next(data);
  }

}
