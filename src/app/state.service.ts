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


}
