import { Component, HostListener, OnInit } from '@angular/core';
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
  constructor(private overlayService: OverlayService) {}
  @HostListener('click', ['$event'])
  public onClick(): void {
    this.overlayService.removePanel();
  }

  public ngOnInit(): void {
    this.panelCtrl.valueChanges.subscribe((c) => {
      console.log('changes in overlay', c);
    });
  }
  panelCtrl: FormControl<string | null | undefined> = new FormControl<
    string | null | undefined
  >('');

  change$: Observable<string | null | undefined> = this.panelCtrl.valueChanges;
}
