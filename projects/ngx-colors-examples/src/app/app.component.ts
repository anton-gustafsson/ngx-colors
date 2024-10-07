import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  ColorHelper,
  NgxColorsComponent,
  NgxColorsTriggerDirective,
  PaletteComponent,
} from '../../../ngx-colors/src/public-api';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rgba } from '../../../ngx-colors/src/lib/models/rgba';
import { Observable, delay, map, of } from 'rxjs';
import { defaultColors } from '../../../ngx-colors/src/lib/utility/default-colors';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ColorOption } from '../../../ngx-colors/src/public-api';

export type ColorsApiColorType = {
  hex: {
    value: string;
  };
  name: {
    value: string;
  };
};
export type ColorsApiResponseType = {
  colors: Array<ColorsApiColorType>;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxColorsComponent,
    ReactiveFormsModule,
    PaletteComponent,
    NgxColorsTriggerDirective,
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(public http: HttpClient) {}
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

  ngOnInit(): void {
    this.setRequest('3A02A9');
  }
  public request: Observable<Array<ColorOption>> | undefined = undefined;

  public setRequest(hex: string) {
    this.request = this.http
      .get<ColorsApiResponseType>(
        `https://www.thecolorapi.com/scheme?hex=${hex}&mode=analogic&count=19`
      )
      .pipe(
        map((r: ColorsApiResponseType) => {
          return r.colors.map((c: ColorsApiColorType) => {
            return { color: c.hex.value, name: c.name.value };
          });
        })
      );
  }

  public getColorsMock1: Observable<Array<ColorOption>> = of(
    defaultColors
  ).pipe(delay(5000));

  public getColorsMock2: Observable<Array<ColorOption>> = of(
    defaultColors
  ).pipe(delay(5000));

  public onModelChanges(value: string | undefined, who: string) {
    console.log('onModelChange', value);
    if (who == 'control' && value) {
      let rgba = ColorHelper.stringToRgba(value);
      let hex = ColorHelper.rgba2Hex(rgba).replace('#', '');
      this.setRequest(hex);
    }
    this.events.push({ who: who, event: 'ngModelChange', value: value });
  }

  public logEvent(value: any) {
    console.log(value);
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
