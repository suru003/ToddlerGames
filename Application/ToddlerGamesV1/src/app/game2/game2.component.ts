import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game2',
  templateUrl: './game2.component.html',
  styleUrls: ['./game2.component.scss']
})
export class Game2Component implements OnInit {

  constructor() { 
  }

  ngOnInit(): void {
  }
  
  public position1: object={ X: 160, Y: 14 };
  public position2: object={ X: 160, Y: 240 };
  public position3: object={ X: 100, Y: 14 };
  public position4: object={ X: 100, Y: 240 };
}
