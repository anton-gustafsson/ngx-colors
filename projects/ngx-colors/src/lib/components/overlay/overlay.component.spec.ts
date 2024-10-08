import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayComponent } from './overlay.component';
import { OverlayService } from '../../services/overlay.service';
import { StateService } from '../../services/state.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OverlayComponent', () => {
  let component: OverlayComponent;
  let fixture: ComponentFixture<OverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayComponent, BrowserAnimationsModule],
      providers: [OverlayService, StateService],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
