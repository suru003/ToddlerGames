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
  console.log ("init ");
//     this.svgService.initializePanZoom();
  }

    onDragEnded(event:any): void {
        console.log("called onDragEnded");
        event.source.element.nativeElement.style.transform = 'none' // visually reset element to its origin
        const source: any = event.source
        source._passiveTransform = { x: 0, y: 0 } // make it so new drag starts from same origin
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
