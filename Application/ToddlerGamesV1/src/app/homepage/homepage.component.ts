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
    this.localStorage.set("difficulty",1);
  }

  public outlineEnable:boolean =true;

  ngOnInit(): void {
    var temp = this.localStorage.get("username");
    if(temp!=null)
      this.username=temp;
  }

  public updateDifficulty(diff:number){
    console.log("updated difficulty = "+diff)
    this.localStorage.set("difficulty",diff);
  }

}
