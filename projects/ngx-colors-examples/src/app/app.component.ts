import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';
import {
  ColorHelper,
  ColorOption,
  NGX_COLORS_CONFIG,
  NgxColorsComponent,
  NgxColorsTriggerDirective
} from '../../../ngx-colors/src/public-api';

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
    NgxColorsComponent,
    ReactiveFormsModule,
    NgxColorsTriggerDirective,
    FormsModule,
    CommonModule
],
  providers: [
    {
      provide: NGX_COLORS_CONFIG,
      useValue: {
        eyedropper: true,
        display: {
          text: true,
          sliders: true,
          palette: true,
        },
        layout: 'full-vertical',
        lockValues: {
          alpha: 1,
        },
      },
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('logIn', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ background: 'red' }),
            stagger(100, [animate('1s ease-out', style({}))]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
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
        `https://www.thecolorapi.com/scheme?hex=${hex}&mode=analogic&count=19`,
      )
      .pipe(
        map((r: ColorsApiResponseType) => {
          return r.colors.map((c: ColorsApiColorType) => {
            return { color: c.hex.value, name: c.name.value };
          });
        }),
      );
  }

  public onModelChanges(value: string | undefined, who: string) {
    console.log('onModelChange', value);
    if (who == 'control' && value) {
      const rgba = ColorHelper.stringToRgba(value);
      const hex = ColorHelper.rgba2Hex(rgba).replace('#', '');
      this.setRequest(hex);
    }
    this.events.push({ who: who, event: 'ngModelChange', value: value });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public logEvent(who: string, event: string, value: any) {
    this.events.push({ who, event, value: value.toString() });
  }
  public clearLog() {
    this.events.length = 0;
  }

  public setBlue() {
    this.testCtrl.setValue('rgba(0,0,255,1)');
    this.test = 'rgba(0,0,255,1)';
  }
  public setRed() {
    this.testCtrl.setValue('rgb(255, 0, 0)');
    this.test = 'rgba(255,0,0,1)';
  }
  public setAlphaRed() {
    // this.testCtrl.setValue('rgba(255, 0, 0, 0.5)');
    this.test = 'rgba(255, 0, 0, 0.5)';
  }
  public setUndefined() {
    this.testCtrl.setValue(undefined);
    this.test = undefined;
  }
}
