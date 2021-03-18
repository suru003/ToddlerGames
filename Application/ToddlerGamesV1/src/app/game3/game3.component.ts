import { Component, ViewChild, ElementRef } from '@angular/core';
import { AnimationBuilder, AnimationMetadata, AnimationPlayer } from '@angular/animations';
import { NextObserver,Subscription, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { brickFallAnimation, followAnimation, heartsAnimation } from '../animations/animations';

import {
  trigger,
  state,
  query,
  group,
  style,
  animation,
  stagger,
  useAnimation,
  keyframes,
  animate,
  transition
} from '@angular/animations';



@Component({
  selector: 'app-game3',
  templateUrl: './game3.component.html',
  styleUrls: ['./game3.component.scss']
})


export class Game3Component{
  top_items = ["../../assets/game3/arrow.png","../../assets/game3/brick1.png"]
  private mouseMoveSubscription: Subscription;
  private clickSubscription: Subscription;

  @ViewChild('animationElement') 
  public animationElement: ElementRef = ViewChild('animationElement');
  public hangingBrick: ElementRef = ViewChild('hangingBrick');
  constructor(private builder: AnimationBuilder) {
    this.mouseMoveSubscription=new Subscription;
    this.clickSubscription=new Subscription;
  }

  // ngOnInit(): void {
  // }
  
  
  public ngAfterViewInit(): void {
    const el = this.animationElement.nativeElement;
    this.mouseMoveSubscription = fromEvent(document, 'mousemove')
      .pipe(throttleTime(50))
      .subscribe(e => {
        if(e instanceof MouseEvent){
          this.rotateEyes(e, el);
          // this.followTopItems(e, el);
        }
    });
    const page = document.querySelector('.page');
    console.log("button "+page)
    if(page!=null){
      this.clickSubscription = fromEvent(page, 'click')
        .pipe(throttleTime(300))
        .subscribe(e => {
          if(e instanceof MouseEvent){
            this.rotateEyes(e, el);
            this.followTopItems(e, el);
          }
      });
    }
  }


  
  private onClick(e: MouseEvent, el: Element): void {
    // const player = this.playerFor(el, heartsAnimation);
    // player.play();
    console.log("clicked element "+el+" MouseEvent "+e)
  }

  private rotateEyes(e: MouseEvent, el: Element): void {
    const rotDegree = this.calculateRotDegree(e, el);

    const player = this.playerFor(el, followAnimation(rotDegree));
    player.play();
  }
  private followTopItems(e: MouseEvent, el: Element): void {
    const cord = this.calculateMovement(e, el);
    console.log("cord = "+cord)
    const player = this.playerFor(el, brickFallAnimation(cord));
    player.play();
  }

  private playerFor(el: Element, animation: AnimationMetadata|AnimationMetadata[]): AnimationPlayer {
    const factory = this.builder.build(animation);
    return factory.create(el);
  }
  private calculateMovement(e: MouseEvent, el: Element): number[] {
    const hangingBrick = document.querySelector('.brick');
    if(hangingBrick!=null){
        const domRect = hangingBrick.getBoundingClientRect();
        console.log("box ="+domRect.x+","+domRect.y)
        const x = domRect.x;
        const y = domRect.y;
        
        return [e.clientX-x,e.clientY-y];
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
