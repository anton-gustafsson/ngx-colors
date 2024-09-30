import {
  ApplicationRef,
  ComponentRef,
  Injectable,
  createComponent,
} from '@angular/core';
import { OverlayComponent } from '../components/overlay/overlay.component';
import { NgxColorsTriggerDirective } from '../directives/trigger.directive';
import { BehaviorSubject } from 'rxjs';
import { Changes } from '../types/changes';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  constructor(private applicationRef: ApplicationRef) {}

  componentRef: ComponentRef<OverlayComponent> | undefined = undefined;
  overlay: HTMLElement | undefined;

  createOverlay(
    trigger: NgxColorsTriggerDirective | undefined,
    attachToId: string | undefined,
    overlayClassName: string | undefined,
    valueEvent: BehaviorSubject<Changes>
  ): ComponentRef<OverlayComponent> {
    console.log(trigger);
    if (this.componentRef != undefined) {
      this.removePanel();
    }

    const hostElement: HTMLElement =
      document.createElement('ngx-colors-overlay');
    if (overlayClassName) {
      hostElement.classList.add(overlayClassName);
    }
    (document.getElementById(attachToId ?? '') ?? document.body).appendChild(
      hostElement
    );
    const injector = this.applicationRef.injector;

    this.componentRef = createComponent(OverlayComponent, {
      hostElement,
      environmentInjector: injector,
    });

    this.componentRef.instance.panel.sharedState$ = valueEvent;
    this.componentRef.instance.triggerNativeElement =
      trigger?.triggerRef.nativeElement;
    if (trigger) {
      let viewportOffset =
        trigger.triggerRef.nativeElement.getBoundingClientRect();

      let top = viewportOffset.top + viewportOffset.height;
      let left = viewportOffset.left;
      this.componentRef.instance.x = left;
      this.componentRef.instance.y = top;
    }
    this.applicationRef.attachView(this.componentRef.hostView);
    return this.componentRef;
  }

  removePanel() {
    if (this.applicationRef && this.componentRef) {
      this.applicationRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      if (this.overlay) {
        this.overlay.remove();
      }
    }
  }
}
