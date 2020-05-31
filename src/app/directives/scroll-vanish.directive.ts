import { Directive, Input, ElementRef, Renderer2, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { DomController, IonContent } from '@ionic/angular';

@Directive({
  selector: '[appScrollVanish]'
})
export class ScrollVanishDirective implements OnInit {
  @Input('appScrollVanish') scrollArea: IonContent;

  private hidden = false;
  private triggerDistance = 20;
  private content: HTMLElement;
  scrollContent;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) { }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(changes: SimpleChanges) {
    if (this.scrollArea) {

      this.scrollArea.getScrollElement().then(el => {
        this.content = el.offsetParent as HTMLElement;
        this.renderer.setStyle(this.content, 'webkitTransition', 'margin-top 700ms');
      });
    }
  }

  ngOnInit() {
    this.initStyles();

    this.scrollArea.ionScroll.subscribe(scrollEvent => {
      const delta = scrollEvent.detail.deltaY;

      if (scrollEvent.detail.currentY === 0 && this.hidden) {
        this.show();
      } else if (!this.hidden && delta > this.triggerDistance) {
        // debugger;
        // const ele = this.scrollArea as ElementRef;
        // if (ele instanceof HTMLElement) {
        //   this.content = (ele as HTMLElement);
        // }
        // this.renderer.setStyle(this.content, 'webkitTransition', 'margin-top 700ms');

        this.hide();
      } else if (this.hidden && delta < -this.triggerDistance) {
        this.show();
      }
    });
  }

  initStyles() {
    this.domCtrl.write(() => {
      // this.renderer.setStyle(
      //   this.element.nativeElement,
      //   'transition',
      //   '0.2s linear'
      // );
      this.renderer.setStyle((this.element.nativeElement as HTMLElement), 'webkitTransition', 'top 700ms');
      // this.renderer.setStyle(this.content, 'webkitTransition', 'margin-top 700ms');
      // this.renderer.setStyle(this.element.nativeElement, 'height', '44px');
    });
  }

  hide() {
    this.domCtrl.write(() => {
      // this.renderer.setStyle((this.element.nativeElement as HTMLElement), 'webkitTransition', 'top 700ms');
      this.renderer.setStyle((this.element.nativeElement as HTMLElement), 'top', '-103px');
      this.renderer.setStyle(this.content, 'margin-top', '0px');
      // this.renderer.setStyle(this.element.nativeElement, 'min-height', '0px');
      // this.renderer.setStyle(this.element.nativeElement, 'height', '0px');
      // this.renderer.setStyle(this.element.nativeElement, 'opacity', '0');
      // this.renderer.setStyle(this.element.nativeElement, 'padding', '0');
      // this.renderer.setStyle(this.element.nativeElement, 'display', 'block');
    });

    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle((this.element.nativeElement as HTMLElement), 'top', '0px');
      this.renderer.setStyle(this.content, 'margin-top', '103px');
      // this.renderer.setStyle(this.element.nativeElement, 'height', 'auto');
      // this.renderer.removeStyle(this.element.nativeElement, 'opacity');
      // this.renderer.removeStyle(this.element.nativeElement, 'min-height');
      // this.renderer.removeStyle(this.element.nativeElement, 'padding');
      // this.renderer.setStyle(this.element.nativeElement, 'display', 'contents');
    });

    this.hidden = false;
  }
}
