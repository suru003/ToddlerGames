import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game2',
  templateUrl: './game2.component.html',
  styleUrls: ['./game2.component.scss']
})
export class Game2Component implements OnInit {
  allPosts: string[];

  constructor() {
    this.allPosts = ["A", "B", "N", "K"];
  }

  ngOnInit(): void {


  }
  score = 0;

  onKey(event: any) { // without type info

    var typedLetter = event.target.value.toUpperCase();
    if (this.allPosts.indexOf(typedLetter) == -1)
      document.getElementById("wrong")!.style.display = "";
    else if (this.allPosts.indexOf(typedLetter) > -1) {
      this.score += 25;
      document.getElementById("wrong")!.style.display = "none";
    }


    if (this.score == 100) {
      document.getElementById("win")!.style.display = "";
    }
  }


  public position1: object = { X: 160, Y: 14 };
  public position2: object = { X: 160, Y: 240 };
  public position3: object = { X: 100, Y: 14 };
  public position4: object = { X: 100, Y: 240 };
}
