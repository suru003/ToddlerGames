import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  public username:string="Guest2031";
  constructor(private localStorage: LocalStorageService) { 
  }

  public outlineEnable:boolean =true;

  ngOnInit(): void {
    var temp = localStorage.getItem("username");
    if(temp!=null)
      this.username=temp;
  }

}
