import { IonContent, DomController } from '@ionic/angular';
import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[scrollHide]'
  })
export class ScrollHideDirective {

  @Input('scrollHide') config: ScrollHideConfig;
  // tslint:disable-next-line:no-input-rename
  @Input('scrollContent') scrollContent: IonContent;

  contentHeight: number;
  scrollHeight: number;
  lastScrollPosition: number;
  lastValue = 0;

  constructor(private element: ElementRef, private renderer: Renderer2, private domCtrl: DomController) {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    if (this.scrollContent && this.config) {
      this.scrollContent.scrollEvents = true;

      const scrollStartFunc = async (ev) => {
        const el = await this.scrollContent.getScrollElement();
        this.contentHeight = el.offsetHeight;
        this.scrollHeight = el.scrollHeight;
        if (this.config.maxValue === undefined) {
          this.config.maxValue = this.element.nativeElement.offsetHeight;
        }
        this.lastScrollPosition = el.scrollTop;
      };

      if (this.scrollContent && this.scrollContent instanceof IonContent) {
        this.scrollContent.ionScrollStart.subscribe(scrollStartFunc);
        this.scrollContent.ionScroll.subscribe(async (ev) => this.adjustElementOnScroll(ev));
        this.scrollContent.ionScrollEnd.subscribe(async (ev) => this.adjustElementOnScroll(ev));

      } else if (this.scrollContent instanceof HTMLElement) {
        (this.scrollContent as HTMLElement).addEventListener('ionScrollStart', scrollStartFunc);
        (this.scrollContent as HTMLElement).addEventListener('ionScroll', async (ev) => this.adjustElementOnScroll(ev));
        (this.scrollContent as HTMLElement).addEventListener('ionScrollEnd', async (ev) => this.adjustElementOnScroll(ev));
      }
    }
  }

  private adjustElementOnScroll(ev) {
    if (ev) {
      this.domCtrl.write(async () => {
        const el = await this.scrollContent.getScrollElement();
        const scrollTop: number = el.scrollTop > 0 ? el.scrollTop : 0;
        const scrolldiff: number = scrollTop - this.lastScrollPosition;
        this.lastScrollPosition = scrollTop;
        let newValue = this.lastValue + scrolldiff;
        newValue = Math.max(0, Math.min(newValue, this.config.maxValue));
        this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `-${newValue}px`);
        this.lastValue = newValue;
      });
    }
  }
}
export interface ScrollHideConfig {
  cssProperty: string;
  maxValue: number;
}
