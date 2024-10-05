import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  NgxColorsComponent,
  NgxColorsTriggerDirective,
} from '../../../ngx-colors/src/public-api';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rgba } from '../../../ngx-colors/src/lib/models/rgba';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxColorsComponent,
    ReactiveFormsModule,
    NgxColorsTriggerDirective,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngx-colors-examples';
  test: string | undefined | null = 'rgba(255,0,255,0.5)';
  testCtrl: FormControl<string | undefined | null> = new FormControl<
    string | undefined | null
  >('rgba(0,255,100,0.9)');

  events: Array<{
    who: string;
    event: string;
    value: string | null | undefined;
  }> = [];

  public onModelChanges(value: string | undefined, who: string) {
    console.log('onModelChange', value);
    this.events.push({ who: who, event: 'ngModelChange', value: value });
  }

  public setBlue() {
    const newValue = new Rgba(0, 0, 255, 1).toString();
    this.testCtrl.setValue(newValue);
    this.test = newValue;
  }
  public setRed() {
    const newValue = new Rgba(255, 0, 0, 1).toString();
    this.testCtrl.setValue(newValue);
    this.test = newValue;
  }
  public setAlphaRed() {
    const newValue = new Rgba(255, 0, 0, 0.5).toString();
    this.testCtrl.setValue(newValue);
    this.test = newValue;
  }
  public setUndefined() {
    const newValue = undefined;
    this.testCtrl.setValue(newValue);
    this.test = newValue;
  }

  public changeValue() {
    this.test = '#000';
    this.testCtrl.setValue('#000');
  }
}
