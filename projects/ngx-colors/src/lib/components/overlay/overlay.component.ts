import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { PanelComponent } from '../panel/panel.component';
import { OverlayService } from '../../services/overlay.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-colors-overlay',
  standalone: true,
  imports: [PanelComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnInit {
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
  constructor(private overlayService: OverlayService) {}

  public ngOnInit(): void {}

  private onScreenMovement() {
    if (!this.triggerNativeElement) return;
    let viewportOffset = this.triggerNativeElement.getBoundingClientRect();
    let top = viewportOffset.top + viewportOffset.height;
    let left = viewportOffset.left;
    this.x = left;
    this.y = top;
  }
}
