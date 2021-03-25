import { Directive, HostListener } from '@angular/core';
import { SVGService } from './svg.service';

@Directive({
  selector: '[appDroppable]'
})
export class DroppableDirective {
  private draggingElement: any;
  private score = 0;
  private svgPoint: any;

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
    if (event.target.getAttribute('draggable')) {
      console.log('draggable element: ' + event.target);
      this.draggingElement = event.target;
      this.svgPoint = this.svgService.getSVGPoint(event, this.draggingElement);
      console.log('mouse down point: ' + this.svgPoint.x + ", " + this.svgPoint.y);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event:any): void {
    console.log('mouseup' + event.target.getAttribute("id"));

    var AABB = {
      collide: function (el1:any, el2:any) {
        if (el1 == null || el2 == null) {
          return false;
        }
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

    var overlapping_element = null;
    if (AABB.collide(hexagon1, this.draggingElement)) {
      overlapping_element = hexagon1;
    } else if (AABB.collide(rectangle1, this.draggingElement)) {
      overlapping_element = rectangle1;
    } else if (AABB.collide(triangle1, this.draggingElement)) {
      overlapping_element = triangle1;
    } else if (AABB.collide(circle1, this.draggingElement)) {
      overlapping_element = circle1;
    } else if (AABB.collide(square1, this.draggingElement)) {
      overlapping_element = square1;
    }

    if (overlapping_element != null) {
      overlapping_element.setAttribute("display", "none");
      this.draggingElement.setAttribute("display", "none");
      this.score = this.score + 20;

      var scoreElement = document.getElementById('score');
      scoreElement!.innerHTML = "<p><strong>" + this.score + "/100" + "</strong></p>";
      document.getElementById("wrong")!.style.display = "none";
    } else {
      document.getElementById("wrong")!.style.display = "";
      this.setPosition(this.draggingElement, { x: this.svgPoint.x, y: this.svgPoint.y  });
    }

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
