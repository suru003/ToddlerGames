import { Component, ViewChild, ElementRef,Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { AnimationBuilder, AnimationMetadata, AnimationPlayer } from '@angular/animations';
import { NextObserver,Subscription, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { brickSlideAnimation, brickFallDownAnimation, followAnimation, heartsAnimation } from '../animations/animations';





@Component({
  selector: 'app-game3',
  templateUrl: './game3.component.html',
  styleUrls: ['./game3.component.scss']
})

export class Game3Component{
  // Image paths for the arrow and bricks
  top_items = ["../../assets/game3/arrow.png","../../assets/game3/brick1.png"]
  private mouseMoveSubscription: Subscription;
  private clickSubscription: Subscription;
  private scrollSubscription: Subscription;
  private stackedBricks;
  private el:Element;

  @ViewChild('animationElement') 
  public animationElement: ElementRef = ViewChild('animationElement');
  
  constructor(private builder: AnimationBuilder, private renderer: Renderer2) {
    // for eyes tracking
    this.mouseMoveSubscription=new Subscription;
    // for click event
    this.clickSubscription=new Subscription;
    // for scroll event
    this.scrollSubscription=new Subscription;
    
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
          this.followTopItems(e, this.el);
        }
    });
    const page = document.querySelector('.page');
    console.log("button "+page)
    if(page!=null){
      // this.clickSubscription = fromEvent(page, 'click')
      //   .pipe(throttleTime(300))
      //   .subscribe(e => {
      //     if(e instanceof MouseEvent){
      //       this.followTopItems(e, this.el);
      //     }
      // });
    
      this.scrollSubscription = fromEvent(page, 'click')
      .pipe(throttleTime(1000))
      .subscribe(e => {
        console.log("wheel event");
        if(e instanceof MouseEvent){
          this.releaseBrick(this.el);
        }
      })
    }
  }



  private rotateEyes(e: MouseEvent, el: Element): void {
    const rotDegree = this.calculateRotDegree(e, el);

    const player = this.playerFor(el, followAnimation(rotDegree));
    player.play();
  }
  private followTopItems(e: MouseEvent, el: Element): void {
    const cord = this.calculateMovement(e, el);
    console.log("cord = "+cord)
    const player = this.playerFor(el, brickSlideAnimation(cord, this.stackedBricks));
    player.play();
  }

  private releaseBrick(el: Element): void {
    const hangingBrick = document.querySelector('.brick'+this.stackedBricks);
    if(hangingBrick!=null){
      const cord_x = hangingBrick.getBoundingClientRect().x - (window.innerWidth/2);
    
      const cord_y = window.innerHeight-(this.stackedBricks*20)-150;
      console.log("cords = "+cord_x+","+cord_y+" tried "+window.pageXOffset)
      const player = this.playerFor(el, brickFallDownAnimation(cord_x, cord_y, this.stackedBricks));
      player.play();
      this.stackedBricks+=1;
    }
  }

  private playerFor(el: Element, animation: AnimationMetadata|AnimationMetadata[]): AnimationPlayer {
    const factory = this.builder.build(animation);
    return factory.create(el);
  }
  private calculateMovement(e: MouseEvent, el: Element): number[] {
    const hangingBrick = document.querySelector('.brick'+this.stackedBricks);
    if(hangingBrick!=null){
        const domRect = hangingBrick.getBoundingClientRect();
        console.log("box ="+domRect.x+","+domRect.y)
        const x = domRect.x;
        const y = domRect.y;
        
        return [e.pageX-(window.innerWidth/2),e.pageY];
    }
    return [];
  }
  private calculateRotDegree(e: MouseEvent, el: Element): number {
    const eye = document.querySelector('.eye');
    if(eye != null){
        const domRect = eye.getBoundingClientRect();
      
        const x = (domRect.left) + (domRect.width / 2);
        const y = (domRect.top) + (domRect.height / 2);
        const rad = Math.atan2(e.pageX - x, e.pageY - y);
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
}
