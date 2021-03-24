import { Directive, HostListener } from '@angular/core';
import { SVGService } from './svg.service';

@Directive({
  selector: '[appDroppable]'
})
export class DroppableDirective {
  private draggingElement: any;

  constructor(private svgService: SVGService) {
  }

  @HostListener('drop', ['$event'])
  onDrop(event:any) {
    console.log('drop' + event.target.getAttribute("id"));
    const dropzone = event.target.childNodes[0];
    const droppedElementId = event.dataTransfer.getData('text');
    const droppedElement = document.getElementById(droppedElementId)!.cloneNode(true) as any;

    dropzone.appendChild(droppedElement);

    droppedElement.setAttribute('draggable', true);

    const svgPoint = this.svgService.getSVGPoint(event, droppedElement);
    this.setPosition(droppedElement, { x: svgPoint.x, y: svgPoint.y  });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event:any): void {
    console.log('mousemove' + event.target.getAttribute("id"));
    if (this.draggingElement) {
      const svgPoint = this.svgService.getSVGPoint(event, this.draggingElement);
      this.setPosition(this.draggingElement, { x: svgPoint.x, y: svgPoint.y  });
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event:any): void {
    console.log('down : ' + event.target.getAttribute("id"));
    if (event.target.getAttribute('draggable')) {
      console.log('draggable element: ' + event.target);
      this.draggingElement = event.target;
    } else {
      console.log('non draggable element: ' + event.target);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event:any): void {
    console.log('mouseup' + event.target.getAttribute("id"));

    var AABB = {
      collide: function (el1:any, el2:any) {
        var rect1 = el1.getBoundingClientRect();
        var rect2 = el2.getBoundingClientRect();

        var col = !(
          rect1.top > rect2.bottom ||
          rect1.right < rect2.left ||
          rect1.bottom < rect2.top ||
          rect1.left > rect2.right
        );

        var type_match = el1.getAttribute("type") == el2.getAttribute("type");
        return col && type_match;
      },
    };

    const hexagon1 = document.getElementById("hexagon1");
    const rectangle1 = document.getElementById("rectangle1");
    const triangle1 = document.getElementById("triangle1");
    const circle1 = document.getElementById("circle1");
    const square1 = document.getElementById("square1");

    var coll = AABB.collide(hexagon1, this.draggingElement) ||
    AABB.collide(rectangle1, this.draggingElement) ||
    AABB.collide(triangle1, this.draggingElement) ||
    AABB.collide(circle1, this.draggingElement) ||
    AABB.collide(square1, this.draggingElement);
    console.log("element: " + this.draggingElement);

    console.log("collides: " + coll);
    this.draggingElement = null;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event:any): void {
    this.draggingElement = null;
  }

  private setPosition(element:any, coord: { x:any, y:any }) {
    element.setAttribute('cx', coord.x);
    element.setAttribute('cy', coord.y);
  }
}
