import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelComponent } from './panel.component';
import { StateService } from '../../services/state.service';
import { OverlayService } from '../../services/overlay.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelComponent, BrowserAnimationsModule],
      providers: [StateService, OverlayService],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
