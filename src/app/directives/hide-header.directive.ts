import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { IonHeader } from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {

  @Input() header: IonHeader;
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  };
  headerHeight;
  scrollContent;
  headerElement: HTMLElement;

  constructor(public element: ElementRef, public renderer: Renderer2) { }

  ngOnInit() {
    if (this.header instanceof HTMLElement) {
      this.headerHeight = (this.header as HTMLElement).clientHeight;
      this.renderer.setStyle(this.header, 'webkitTransition', 'top 700ms');
      this.scrollContent = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
      this.renderer.setStyle(this.scrollContent, 'webkitTransition', 'margin-top 700ms');
    }
  }

  onContentScroll(event) {
    if (event.scrollTop > 56) {
      this.renderer.setStyle(this.header, 'top', '-56px');
      this.renderer.setStyle(this.scrollContent, 'margin-top', '0px');
    } else {
      this.renderer.setStyle(this.header, 'top', '0px');
      this.renderer.setStyle(this.scrollContent, 'margin-top', '56px');
    }
  }

}
