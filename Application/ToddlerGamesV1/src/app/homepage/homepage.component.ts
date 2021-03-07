import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor() { }

  outlineEnable:boolean =true;
  onButtonTap(): void {
    console.log("Button was pressed");
}

  ngOnInit(): void {
  }

}
