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
  verified;
  constructor( private router:Router, private ar:ActivatedRoute, private ds:DataService) { }

  ngOnInit(): void {
    
    this.ar.queryParamMap.subscribe((data)=>{
      this.hash = data.get("hash");
    });

    this.ds.verifyAccount({hash:this.hash}).subscribe((res:any)=>{
      if(res.status == true){
        localStorage.setItem('email', res.data.email);
        this.ds.spinnerControl('hide');
        this.verified = 1;
        alert('congratulations! Your account is verified');
        this.router.navigate(['/chat-dashboard']);
      }else{
         this.ds.spinnerControl('hide');
         this.verified = 0;
         alert(res.data.err);
         this.router.navigate(['/sign-up']);
      }
    }, (err)=>{
      this.verified = 0;
      this.ds.spinnerControl('hide');
      alert("sorry some error has occured");
    })
    
    
    
  }

}
