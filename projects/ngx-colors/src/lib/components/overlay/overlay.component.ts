import { Component, HostListener, ViewChild } from '@angular/core';
import { PanelComponent } from '../panel/panel.component';
import { OverlayService } from '../../services/overlay.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ngx-colors-overlay',
  standalone: true,
  imports: [PanelComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {
  constructor(private overlayService: OverlayService) {}

  x: number = 0;
  y: number = 0;
  triggerNativeElement: HTMLElement | undefined = undefined;

  @ViewChild(PanelComponent, { static: true })
  panel!: PanelComponent;
  @HostListener('document:scroll')
  onScroll() {
    this.onScreenMovement();
  }
  @HostListener('window:resize')
  onResize() {
    this.onScreenMovement();
  }
  @HostListener('pointerdown', ['$event'])
  public onClick(): void {
    this.overlayService.removePanel();
  }

  private onScreenMovement() {
    if (!this.triggerNativeElement) return;
    const viewportOffset = this.triggerNativeElement.getBoundingClientRect();
    const top = viewportOffset.top + viewportOffset.height;
    const left = viewportOffset.left;
    this.x = left;
    this.y = top;
  }
}
