import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Game1Component } from './game1.component';
import { MatCardModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SVGService } from './svg.service';
import { DraggableDirective } from './draggable.directive';
import { DroppableDirective } from './droppable.directive';

@NgModule({
  declarations: [
    Game1Component,
    DraggableDirective,
    DroppableDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    DragDropModule
  ],
  providers: [SVGService],
  bootstrap: [Game1Component]
})
export class Game1Module { }
