import { Component, ViewChild, ElementRef,HostListener, Renderer2, RendererFactory2 } from '@angular/core';
import { AnimationBuilder, AnimationMetadata, AnimationPlayer } from '@angular/animations';
import { NextObserver,Subscription, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { brickSlideAnimation, brickFallDownAnimation, followAnimation, heartsAnimation } from '../animations/animations';
import { LocalStorageService } from '../local-storage.service';

import * as data from './levels_desc.json'


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
  private validGame = true;
  
  // temporary
  public last_dif=0;
  public dif=0;
  public curr_x=0;
  private el:Element;
  public page_x=0;
  public page_y=0;
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


  public bricksList:number[] = [];
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    // console.log("event "+event.keyCode);
    if(event.keyCode==32){
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
    //reset
    // localStorage.set("current_level",1);

    //level
    this.level = localStorage.get("current_level");
    if(this.level==null)
      this.level=1;
      
    // updating level parameters
    // highscore
    this.highScore = localStorage.get("highscore_level_"+this.level);
    if(this.highScore==null)
      this.highScore=0;
    // highscore
    this.difficulty = localStorage.get("difficulty");
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
    if(direction==1){
      const player = this.playerFor(el, brickSlideAnimation(cord, this.difficulty, this.stackedBricks));
      player.play();
    }
    else{
      const player = this.playerFor(el, brickSlideAnimation(-cord, this.difficulty, this.stackedBricks));
      player.play();
    }
  }

  private releaseBrick(el: Element): void {
    if(!this.validGame)
      return 
    
    const hangingBrick = document.querySelector('.brick'+this.stackedBricks);
    if(hangingBrick!=null){
      const cord_x = hangingBrick.getBoundingClientRect().x - (window.innerWidth/2);
      const cord_y = window.innerHeight-((this.stackedBricks+1)*20)-150;  // 1 for base brick and 150 padding
      // console.log("cords = "+cord_x+","+cord_y+" tried "+window.pageXOffset)
      // console.log("cords = "+cord_x+",this.baseBrick_x "+this.baseBrick_x+" this.brickWidth="+this.brickWidth);
      this.curr_x = cord_x;
      const base_diff = Math.abs(this.baseBrick_x-cord_x);
      var last_brick_diff = Math.abs(this.lastBrick_x-cord_x);
      this.dif= base_diff;
      this.last_dif= last_brick_diff;

      this.lastBrick_x = cord_x;
      
      console.log("base_diff="+base_diff)
      if(this.stackedBricks==0)
        last_brick_diff-=100;

      console.log("last_brick_diff="+last_brick_diff)
      if(last_brick_diff==0){
        this.score+=1;
      }
      else if((this.dif_limit<base_diff && base_diff<this.dif_limit*3) && this.dif_limit>last_brick_diff){
        this.score+=(1-(last_brick_diff/this.brickWidth));
      }
      else{
        // console.log("(this.dif_limit<base_diff && base_diff<this.dif_limit*3) "+(this.dif_limit<base_diff && base_diff<this.dif_limit*3))
        // console.log("this.dif_limit = "+this.dif_limit+" last_brick_diff "+last_brick_diff)
        // console.log("this.dif_limit<last_brick_diff"+(this.dif_limit<last_brick_diff))
        this.game_over=false;
        if(this.highScore<this.score)
          localStorage.setItem("highscore_level_"+this.level, this.score+"");
        this.validGame=false
        
      }
      const player = this.playerFor(el, brickFallDownAnimation(cord_x, cord_y, this.stackedBricks));
      player.play();
      this.stackedBricks+=1;
      
      if(this.stackedBricks==this.totalBricks){
          this.level_completed = false;
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
    localStorage.setItem("current_level",this.level+1+"") 
    window.location.reload();
  }

}
