import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game2',
  templateUrl: './game2.component.html',
  styleUrls: ['./game2.component.scss']
})
export class Game2Component implements OnInit {
  allPosts: string[];

  constructor() {
    this.allPosts = ["A", "B", "N", "K","S"];
  }

  ngOnInit(): void {
  }
  
  openHelp(){
    document.getElementById("myModal")!.style.display = "block";
  }
  closeModal(){
    document.getElementById("myModal")!.style.display = "none";
  }
  score = 0;
  typeInput: any;
  A = "../../assets/game2/A.png";
  N = "../../assets/game2/N.png";
  B = "../../assets/game2/B.png";
  K = "../../assets/game2/K.png";
  S = "../../assets/game2/S.png";
  pop = "../../assets/game2/pop.png";
  onKey(event: any) { // without type info

    var typedLetter = event.target.value.toUpperCase();
    event.target.value = '';
    if (this.allPosts.indexOf(typedLetter) == -1)
      document.getElementById("wrong")!.style.display = "";
    else if (this.allPosts.indexOf(typedLetter) > -1) {
      this.score += 100/this.allPosts.length;
      document.getElementById("wrong")!.style.display = "none";
      if (typedLetter == "A")
        this.A = this.pop;
      if (typedLetter == "B")
        this.B = this.pop;
      if (typedLetter == "N")
        this.N = this.pop;
      if (typedLetter == "K")
        this.K = this.pop;
      if (typedLetter == "S")
        this.S = this.pop;
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
