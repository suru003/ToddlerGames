import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private localStorage:LocalStorageService, private router: Router ) { }

  ngOnInit(): void {
  }


  public login(){
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    // if(username!=null && password!= null){
    //   alert( (<HTMLInputElement>username).value=="user21");
    //   alert((<HTMLInputElement>password).value=="pass");
    // }
    if(username!=null && password!= null && (<HTMLInputElement>username).value=="user21" && (<HTMLInputElement>password).value=="pass"){
      var name:string = (<HTMLInputElement>username).value
      localStorage.setItem("username",name)
      alert("Login success")
      this.router.navigate(['/app-homepage'])
      .then(success => console.log('navigation success?' , success))
      .catch(console.error); 
    }
    else{
      alert("Incorrect Username/Password!")
    }
  }

}
