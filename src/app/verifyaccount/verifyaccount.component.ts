import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-verifyaccount',
  templateUrl: './verifyaccount.component.html',
  styleUrls: ['./verifyaccount.component.css']
})
export class VerifyaccountComponent implements OnInit {
  hash;
  constructor( private router:Router, private ar:ActivatedRoute, private ds:DataService) { }

  ngOnInit(): void {
    
    this.ar.queryParamMap.subscribe((data)=>{
      this.hash = data.get("hash");
    });

    this.ds.verifyAccount({hash:this.hash}).subscribe((res:any)=>{
      if(res.status == true){
        localStorage.setItem('email', res.data.email);
        this.ds.spinnerControl('hide');
        alert('congratulations! Your account is verified');
        this.router.navigate(['/chat-dashboard']);
      }else{
         this.ds.spinnerControl('hide');
         alert(res.data.err);
         this.router.navigate(['/sign-up']);
      }
    }, (err)=>{
      this.ds.spinnerControl('hide');
      alert("sorry some error has occured");
    })
    
    
    
  }

}
