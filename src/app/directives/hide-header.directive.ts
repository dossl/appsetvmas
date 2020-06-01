import { Directive, Input, ElementRef, Renderer2, OnInit, SimpleChanges } from '@angular/core';
import { DomController, IonContent } from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {

  @Input('appHideHeader') scrollArea: IonContent;

  private hidden = false;
  private triggerDistance = 20;
  scrollContent;
  footerContent;
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) { }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (this.scrollArea) {

  //     this.scrollArea.getScrollElement().then(el => {
  //       this.footerContent = el.offsetParent as HTMLElement;
  //       // this.renderer.setStyle(this.footerContent, 'webkitTransition', '--offset-bottom 700ms');
  //     });
  //   }
  // }

  ngOnInit() {
    this.initStyles();

    this.scrollArea.ionScroll.subscribe(scrollEvent => {
      const delta = scrollEvent.detail.deltaY;

      if (scrollEvent.detail.currentY === 0 && this.hidden) {
        this.show();
      } else if (!this.hidden && delta > this.triggerDistance) {
        this.hide();
      } else if (this.hidden && delta < -this.triggerDistance) {
        this.show();
      }
    });
  }

  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.setStyle((this.element.nativeElement as HTMLElement), 'webkitTransition', 'bottom 700ms');
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle((this.element.nativeElement as HTMLElement), 'bottom', '-67px');
      // this.renderer.setStyle(this.footerContent, '--offset-bottom', '67px');
    });

    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle((this.element.nativeElement as HTMLElement), 'bottom', '0px');
      // this.renderer.setStyle(this.footerContent, '--offset-bottom', '0px');
    });

    this.hidden = false;
  }

}
