import { Component, ViewChild, ElementRef,HostListener, Renderer2, RendererFactory2 } from '@angular/core';
import { AnimationBuilder, AnimationMetadata, AnimationPlayer } from '@angular/animations';
import { NextObserver,Subscription, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { brickSlideAnimation, brickFallDownAnimation, followAnimation, heartsAnimation } from '../animations/animations';
import { LocalStorageService } from '../local-storage.service';

import * as data from './levels_desc.json'
import { I } from 'angular-bootstrap-md/lib/free/utils/keyboard-navigation';


@Component({
  selector: 'app-game3',
  templateUrl: './game3.component.html',
  styleUrls: ['./game3.component.scss']
})

export class Game3Component{
  private levels_json: any = (data as any).default;

  // Image paths for the arrow and bricks
  top_items = ["../../assets/game3/arrow.png","../../assets/game3/brick1.png"]
  
  private mouseMoveSubscription: Subscription;
  private clickSubscription: Subscription;
  
  // will update while playing
  private stackedBricks;
  private brickWidth:number=100;
  public lastBrick_x:number=0;
  public score:number=0;

  // limit brick dif
  private dif_limit = 50;
  public validGame = true;

  // temporary
  public last_dif=0;
  public dif=0;
  public curr_x=0;
  private el:Element;
  public page_x=0;
  public page_y=0;
  private score_adder = 0;
  public page_w = window.innerWidth;

  public game_over:boolean;
  public level_completed:boolean;

  // Level parameters
  public level:number;
  private totalBricks:number;
  private range:number;
  public highScore:number;
  private difficulty:number;

  
  // bottom-most brick
  public baseBrick_x:number=1;
  public baseBrickPadding:number=50;


  // gif co-ordinates and hidden
  public clap_hide = true;
  public no_hide = true;
  public congrats_hide = true;
  
  public clap_left = 0;
  public clap_top = 0;
  public no_left = 0;
  public no_top = 0;

  // gif files
  public correct_stacked=["../../assets/game3/clap.gif","../../assets/game3/dabbing.gif","../../assets/game3/party.gif","../../assets/game3/perfect.gif"]
  public incorrect_stacked=["../../assets/game3/no.gif","../../assets/game3/exploding_head.gif","../../assets/game3/facepalm.gif","../../assets/game3/tongue_out.gif","../../assets/game3/thumps_down.gif"]
  // since index starts with 0
  private len_correct_stacked = 3
  private len_incorrect_stacked = 4
  public cur_correct_stacked=0
  public cur_incorrect_stacked=0
  
  
  public bricksList:number[] = [];
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    // console.log("event "+event.keyCode);
    if(event.keyCode==32){
      // console.log(this.validGame+" and  "+this.level_completed);
      this.releaseBrick(this.el);
    }
    else if(event.keyCode==37){
      this.followTopItems(this.el,-1);
    }
    else if(event.keyCode==39){
      this.followTopItems(this.el,1);
    }
  }
  
  @ViewChild('animationElement') 
  public animationElement: ElementRef = ViewChild('animationElement');


  constructor(private builder: AnimationBuilder, private localStorage : LocalStorageService, private renderer: Renderer2) {
    // reset
    // this.resetGame()

    //level
    this.level = localStorage.get("current_level");
    console.log("this.level = "+this.level)
    if(this.level==null)
      this.level=1;
      
    // updating level parameters
    // highscore
    this.highScore = localStorage.get("highscore_level_"+this.level);
    if(this.highScore==null)
      this.highScore=0;
    // highscore
    this.difficulty = localStorage.get("level");
    if(this.difficulty==null)
      this.difficulty=1;

    console.log(this.levels_json);
    console.log("levels_json[this.level][bricks_number] = "+this.levels_json[this.level]["bricks_number"])
    // level range
    this.range = Number(this.levels_json[this.level]["range"]);

    // total level bricks
    this.totalBricks = Number(this.levels_json[this.level]["bricks_number"]);
    for (let i = 0; i < this.totalBricks; i++) {
    this.bricksList.push(i);
    }
    

    // score adder
    this.score_adder = 100/this.totalBricks
    
    // randomize base brick
    var range_rem = 1 - this.range;
    while(40<this.baseBrickPadding && this.baseBrickPadding<60){
      this.baseBrickPadding = this.getRandomArbitrary(range_rem+0.1,1-range_rem-0.1)*100;
    }
    console.log("this.baseBrickPadding "+this.baseBrickPadding);
    this.level_completed=true;
    this.game_over=true;
    // for eyes tracking
    this.mouseMoveSubscription=new Subscription;
    // for click event
    this.clickSubscription=new Subscription;

    // currently stacked bricks
    this.stackedBricks = 0;
    
    // intializing animationElement
    this.el = this.animationElement.nativeElement;
    
  }
  
  openHelp(){
    document.getElementById("myModal")!.style.display = "block";
  }
  closeModal(){
    document.getElementById("myModal")!.style.display = "none";
  }
  public ngAfterViewInit(): void {
    this.el = this.animationElement.nativeElement;
    
    
    this.mouseMoveSubscription = fromEvent(document, 'mousemove')
      .pipe(throttleTime(50))
      .subscribe(e => {
        if(e instanceof MouseEvent){
          this.rotateEyes(e, this.el);
        }
    });

    // left down button
    const dl_arrow = document.querySelector('.dl_arrow');
    if(dl_arrow!=null){
        this.clickSubscription = fromEvent(dl_arrow, 'click')
        .pipe(throttleTime(1000))
        .subscribe(e => {

          if(e instanceof MouseEvent){
            this.releaseBrick(this.el);
          }
        });
    }

    // right down button
    const dr_arrow = document.querySelector('.dr_arrow');
    if(dr_arrow!=null){
        this.clickSubscription = fromEvent(dr_arrow, 'click')
        .pipe(throttleTime(1000))
        .subscribe(e => {

          if(e instanceof MouseEvent){
            this.releaseBrick(this.el);
          }
        });
    }
    // left move button
    const l_arrow = document.querySelector('.l_arrow');
    if(l_arrow!=null){
        this.clickSubscription = fromEvent(l_arrow, 'click')
        .pipe(throttleTime(1000))
        .subscribe(e => {

          if(e instanceof MouseEvent){
            this.followTopItems(this.el,-1);
          }
        });
    }

    // right move button
    const r_arrow = document.querySelector('.r_arrow');
    if(r_arrow!=null){
        this.clickSubscription = fromEvent(r_arrow, 'click')
        .pipe(throttleTime(1000))
        .subscribe(e => {

          if(e instanceof MouseEvent){
            this.followTopItems(this.el,1);
          }
        });
    }
  
  // assign base brick x 
  const bottom_brick_element = document.querySelector('.bottom_brick');
  if(bottom_brick_element!=null) {
    this.baseBrick_x = bottom_brick_element.getBoundingClientRect().x - (window.innerWidth/2);
    this.lastBrick_x = this.baseBrick_x;
    console.log("this.baseBrick_x "+this.baseBrick_x);
  }
  else
    this.baseBrick_x = 0;
  }



  private rotateEyes(e: MouseEvent, el: Element): void {
    const rotDegree = this.calculateRotDegree(e, el);

    const player = this.playerFor(el, followAnimation(rotDegree));
    player.play();
  }
  private followTopItems(el: Element, direction:number): void {
    if(!this.validGame)
      return 
    const cord = this.calculateMovement(el);
    console.log("cord = "+cord)
    // right slide movement
    if(direction==1){
      const player = this.playerFor(el, brickSlideAnimation(cord, this.difficulty, this.stackedBricks));
      player.play();
    }
    // left slide movement
    else{
      const player = this.playerFor(el, brickSlideAnimation(-cord, this.difficulty, this.stackedBricks));
      player.play();
    }
  }

  private releaseBrick(el: Element): void {
    if(!this.validGame)
      return 
    
    // getting current hanging brick
    const hangingBrick = document.querySelector('.brick'+this.stackedBricks);
    if(hangingBrick!=null){
      const hangingBrick_x = hangingBrick.getBoundingClientRect().x 
      const cord_x = hangingBrick_x - (window.innerWidth/2);
      const cord_y = window.innerHeight-((this.stackedBricks+1)*20)-150;  // 1 for base brick and 150 padding
      // console.log("cords = "+cord_x+","+cord_y+" tried "+window.pageXOffset)
      // console.log("cords = "+cord_x+",this.baseBrick_x "+this.baseBrick_x+" this.brickWidth="+this.brickWidth);
      this.curr_x = cord_x;
      // base brick diff
      const base_diff = Math.abs(this.baseBrick_x-cord_x);
      // last brick diff
      var last_brick_diff = Math.abs(this.lastBrick_x-cord_x);
      this.dif= base_diff;
      this.last_dif= last_brick_diff;

      this.lastBrick_x = cord_x;
      
      // console.log("base_diff="+base_diff)
      // padding -
      if(this.stackedBricks==0)
        last_brick_diff-=100;
      console.log("base_diff="+base_diff)
      console.log("last_brick_diff="+last_brick_diff)

      // might decrease that diff limit for bonus point in higher difficulties
      if(-5<last_brick_diff && last_brick_diff<5){
        this.clap_left = hangingBrick_x;
        this.clap_top = cord_y-100;
        this.score += 10;
        
        this.cur_correct_stacked = Math.round(this.getRandomArbitrary(0,this.len_correct_stacked));
        console.log(" this.cur_correct_stacked ="+this.cur_correct_stacked);
      // delay
        (async () => { 
          this.clap_hide = false;
          await this.delay(1000);
          this.clap_hide = true;
        })();
        
      }
      if((this.dif_limit<base_diff && base_diff<this.dif_limit*3) && this.dif_limit>last_brick_diff){
        // this.score+=(1-(last_brick_diff/this.brickWidth));
        this.score+=this.score_adder;
      }
      else{
        this.cur_incorrect_stacked = Math.round(this.getRandomArbitrary(0,this.len_incorrect_stacked));
        console.log(" this.cur_incorrect_stacked ="+this.cur_incorrect_stacked);
        this.game_over = false;
        this.no_hide = false;
        this.no_left = hangingBrick_x;
        this.no_top = cord_y-100;
        
        this.validGame=false
        
      }
      
      // Brick fall 
      const player = this.playerFor(el, brickFallDownAnimation(cord_x, cord_y, this.stackedBricks));
      player.play();
      this.stackedBricks+=1;
      
      if(this.stackedBricks==this.totalBricks && this.validGame){
          this.level_completed = false;
      }

      // level highscore update
      if(this.highScore<this.score){
        if(!this.level_completed || !this.validGame){
          this.congrats_hide = false;
          this.highScore = this.score;
        }
        this.localStorage.set("highscore_level_"+this.level, this.score+"");
      }
      
      if (this.level == 1) {
        localStorage.setItem("game3EasyScore", this.score.toString());
      } else if (this.level == 2) {
        localStorage.setItem("game3MedScore", this.score.toString());
      } else if (this.level == 3) {
        localStorage.setItem("game3HardScore", this.score.toString());
      }
    }
  }
  private playerFor(el: Element, animation: AnimationMetadata|AnimationMetadata[]): AnimationPlayer {
    const factory = this.builder.build(animation);
    return factory.create(el);
  }
  private calculateMovement(el: Element): number {
    const hangingBrick = document.querySelector('.brick'+this.stackedBricks);
    if(hangingBrick!=null){
        const domRect = hangingBrick.getBoundingClientRect();
        console.log("box ="+domRect.x+","+domRect.y)
        const x = domRect.x;
        const y = domRect.y;
        const pageWidth = window.innerWidth;
        const padding = pageWidth*0.1;
        const dif = x - padding
        return pageWidth*0.4;
    }
    return 0;
  }
  private calculateRotDegree(e: MouseEvent, el: Element): number {
    const eye = document.querySelector('.eye');
    if(eye != null){
        const domRect = eye.getBoundingClientRect();
      
        const x = (domRect.left) + (domRect.width / 2);
        const y = (domRect.top) + (domRect.height / 2);
        const rad = Math.atan2(e.pageX - x, e.pageY - y);
        this.page_x = e.pageX;
        this.page_y = e.pageY;
        
      return (rad * (180 / Math.PI) * -1) + 180;
    }
    return 0;
  }

  public ngOnDestroy(): void {
    if (this.mouseMoveSubscription) {
      this.mouseMoveSubscription.unsubscribe();
    }
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
    }
  }

  private getRandomArbitrary(min:number, max:number):number {
  return Math.random() * (max - min) + min;
}

  public reloadPage(){
    window.location.reload();
  }
  public nextLevel(){

    var temp:number = +this.level+1;
    this.localStorage.set("current_level",temp+"") ;
    window.location.reload();
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public resetGame(){
    this.localStorage.set("current_level",1);
    var i = 1
    //https://stackoverflow.com/questions/41684114/easy-way-to-make-a-confirmation-dialog-in-angular
    if(confirm("confirm please?")){
      for(i=1;i<7;i++){
        this.localStorage.set("highscore_level_"+i,0)
      }
      this.reloadPage()
      }
  }
}
