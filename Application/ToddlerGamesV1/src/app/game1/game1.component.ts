import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SVGService } from './svg.service';


@Component({
  selector: 'app-game1',
  templateUrl: './game1.component.html',
  styleUrls: ['./game1.component.scss']
})

export class Game1Component implements OnInit {
  title = 'Drag & Drop Shapes';
  constructor(private svgService: SVGService) {
  }

  ngOnInit(): void {
//     this.svgService.initializePanZoom();
  }
}
//
// export class Game1Component {
//  title = 'Drag & Drop Shapes';
//
// MoviesList = [
//     'black square',
//     'green circle'
//   ];
//
//  MoviesWatched = [
//  'green square',
//  'grey square'
//   ];
//
//
//   onDrop(event: CdkDragDrop<string[]>) {
//       if (event.previousContainer === event.container) {
//         moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//       } else {
//         transferArrayItem(event.previousContainer.data,
//           event.container.data,
//           event.previousIndex,
//           event.currentIndex);
//       }
//     }
// }
//
