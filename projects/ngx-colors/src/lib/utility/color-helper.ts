import { IColorModel } from '../interfaces/color-format';
import { Cmyk } from '../models/cmyk';
import { Hsla } from '../models/hsla';
import { Hsva } from '../models/hsva';
import { Rgba } from '../models/rgba';
import { ColorModel } from '../types/color-model';

export const HEX_REGEX: RegExp = /#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})$/;
export const RGBA_REGEX: RegExp =
  /(rgb)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*(?:\.\d+)?%?)\s*)?\)$/;
export const HSLA_REGEX: RegExp =
  /(hsl)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d*(?:\.\d+)?%?)\s*)?\)$/;
export const HSVA_REGEX: RegExp =
  /(hsv)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d*(?:\.\d+)?%?)\s*)?\)$/;
export const CMYK_REGEX: RegExp =
  /cmyk\(\s*(\d+(?:\.\d+)?)\s*%?,\s*(\d+(?:\.\d+)?)\s*%?,\s*(\d+(?:\.\d+)?)\s*%?(?:,\s*?(\d+(?:\.\d+)?)\s*%?)?\)$/;

export class ColorHelper {
  public static rgbaToColorModel(
    rgba: Rgba,
    format: ColorModel,
  ): IColorModel | string {
    switch (format) {
      case 'HEXA':
        return this.rgba2Hex(rgba);
      case 'HSLA':
        return this.rgba2Hsla(rgba);
      case 'HSVA':
        return this.rgba2Hsva(rgba);
      case 'CMYK':
        return this.rgba2Cmyk(rgba);
      case 'RGBA':
        return rgba;
      default:
        throw new Error(
          `Invalid output format: '${format}'. Available formats are: HEX, HSLA, HSVA, CMYK, RGBA.`,
        );
    }
  }

  //rgba to everything
  public static rgba2Hsla(rgba: Rgba): Hsla {
    const rNorm = rgba.r / 255;
    const gNorm = rgba.g / 255;
    const bNorm = rgba.b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

      switch (max) {
        case rNorm:
          h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
          break;
        case gNorm:
          h = ((bNorm - rNorm) / delta + 2) * 60;
          break;
        case bNorm:
          h = ((rNorm - gNorm) / delta + 4) * 60;
          break;
      }
    }
    return new Hsla(h, s, l, rgba.a);
  }

  public static rgba2Hsva(rgba: Rgba): Hsva {
    const rNorm = rgba.r / 255;
    const gNorm = rgba.g / 255;
    const bNorm = rgba.b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h: number;
    if (delta === 0) {
      h = 0;
    } else if (max === rNorm) {
      h = 60 * (((gNorm - bNorm) / delta) % 6);
    } else if (max === gNorm) {
      h = 60 * ((bNorm - rNorm) / delta + 2);
    } else {
      h = 60 * ((rNorm - gNorm) / delta + 4);
    }

    if (h < 0) {
      h += 360;
    }
    let s: number;
    if (max === 0) {
      s = 0;
    } else {
      s = delta / max;
    }
    const v = max;

    return new Hsva(h, s, v, rgba.a);
  }

  public static rgba2Cmyk(rgba: Rgba): Cmyk {
    const r = rgba.r / 255;
    const g = rgba.g / 255;
    const b = rgba.b / 255;
    const a = rgba.a;

    const k: number = 1 - Math.max(r, g, b);

    if (k === 1) {
      return new Cmyk(0, 0, 0, 1, a);
    } else {
      const c = (1 - r - k) / (1 - k);
      const m = (1 - g - k) / (1 - k);
      const y = (1 - b - k) / (1 - k);

      return new Cmyk(c, m, y, k, a);
    }
  }

  public static rgba2Hex(rgba: Rgba): string {
    const r = Math.round(rgba.r).toString(16).padStart(2, '0');
    const g = Math.round(rgba.g).toString(16).padStart(2, '0');
    const b = Math.round(rgba.b).toString(16).padStart(2, '0');
    const a =
      rgba.a === 1
        ? ''
        : Math.round(rgba.a * 255)
            .toString(16)
            .padStart(2, '0');

    return '#' + r + g + b + a;
  }
  //everything to rgba
  public static hsla2Rgba(hsla: Hsla): Rgba {
    const { h, s, l, a } = hsla;

    const sNorm = s;
    const lNorm = l;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;

    let rPrime = 0,
      gPrime = 0,
      bPrime = 0;

    if (0 <= h && h < 60) {
      rPrime = c;
      gPrime = x;
      bPrime = 0;
    } else if (60 <= h && h < 120) {
      rPrime = x;
      gPrime = c;
      bPrime = 0;
    } else if (120 <= h && h < 180) {
      rPrime = 0;
      gPrime = c;
      bPrime = x;
    } else if (180 <= h && h < 240) {
      rPrime = 0;
      gPrime = x;
      bPrime = c;
    } else if (240 <= h && h < 300) {
      rPrime = x;
      gPrime = 0;
      bPrime = c;
    } else if (300 <= h && h < 360) {
      rPrime = c;
      gPrime = 0;
      bPrime = x;
    }

    const r = Math.round((rPrime + m) * 255);
    const g = Math.round((gPrime + m) * 255);
    const b = Math.round((bPrime + m) * 255);

    return new Rgba(r, g, b, a);
  }

  public static hsva2Rgba(hsva: Hsva): Rgba {
    let r: number, g: number, b: number;

    const h = hsva.h / 360,
      s = hsva.s,
      v = hsva.v,
      a = hsva.a;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
      default:
        (r = 0), (g = 0), (b = 0);
    }

    return new Rgba(r * 255, g * 255, b * 255, a);
  }

  public static hex2Rgba(hex: string): Rgba {
    const re = HEX_REGEX;
    const match: RegExpExecArray | null = re.exec(hex.trim());
    let r: string;
    let g: string;
    let b: string;
    let a: string;
    if (!match) {
      throw new Error(
        `Invalid hex color format: "${hex}". Please ensure it follows the format #RRGGBB,#RGB, #RGBA or #RRGGBBAA.`,
      );
    }
    if (match[1].length > 4) {
      r = match[1].substring(0, 2);
      g = match[1].substring(2, 4);
      b = match[1].substring(4, 6);
      a = match[1].substring(6, 8);
    } else {
      r = match[1][0] + match[1][0];
      g = match[1][1] + match[1][1];
      b = match[1][2] + match[1][2];
      a = (match[1][3] ?? 'F') + (match[1][3] ?? 'F');
    }
    a = a === '' ? 'FF' : a;
    return new Rgba(
      parseInt(r, 16),
      parseInt(g, 16),
      parseInt(b, 16),
      parseInt(a, 16) / 255,
    );
  }

  public static cmykToRgb(cmyk: Cmyk): Rgba {
    const r = (1 - cmyk.c) * (1 - cmyk.k);
    const g = (1 - cmyk.m) * (1 - cmyk.k);
    const b = (1 - cmyk.y) * (1 - cmyk.k);
    return new Rgba(r * 255, g * 255, b * 255, cmyk.a);
  }

  public static stringToColorModel(
    value: string,
    colorModel: ColorModel,
  ): IColorModel | string {
    const color = this.stringToColor(value);
    const rgba = this.colorToRgba(color);
    return this.rgbaToColorModel(rgba, colorModel);
  }

  public static colorToColorModel(
    value: IColorModel | string,
    colorModel: ColorModel,
  ): IColorModel | string {
    const rgba = this.colorToRgba(value);
    return this.rgbaToColorModel(rgba, colorModel);
  }

  public static colorToRgba(value: IColorModel | string) {
    if (value instanceof Hsla) {
      return this.hsla2Rgba(value);
    } else if (value instanceof Hsva) {
      return this.hsva2Rgba(value);
    } else if (value instanceof Cmyk) {
      return this.cmykToRgb(value);
    } else if (typeof value == 'string') {
      return this.hex2Rgba(value);
    } else if (value instanceof Rgba) {
      return value;
    } else {
      throw new Error('The input value is not a valid ColorModel');
    }
  }

  public static stringToRgba(value: string): Rgba {
    return this.stringToColorModel(value, 'RGBA') as Rgba;
  }

  public static stringToColorModelString(
    value: string,
    colorModel: ColorModel,
  ): string {
    return this.stringToColorModel(value, colorModel).toString();
  }

  private static parseAlpha(alphaString: string): number {
    let alpha;
    if (alphaString) {
      const percIndex = alphaString.indexOf('%');
      if (percIndex > 0) {
        alpha = parseFloat(alphaString.substring(0, percIndex)) / 100;
      } else {
        alpha = parseFloat(alphaString);
      }
    }
    return alpha ?? 1;
  }

  public static stringToColor(value: string): IColorModel | string {
    const parseAlpha = this.parseAlpha;
    const stringParsers: Array<{
      regex: RegExp;
      parseFunction: (
        execResult: RegExpExecArray,
        originalValue: string,
      ) => IColorModel | string;
    }> = [
      {
        regex: RGBA_REGEX,
        parseFunction: function (execResult: RegExpExecArray, _: string) {
          return new Rgba(
            parseInt(execResult[2], 10),
            parseInt(execResult[3], 10),
            parseInt(execResult[4], 10),
            parseAlpha(execResult[5]),
          );
        },
      },
      {
        regex: HSLA_REGEX,
        parseFunction: function (execResult: RegExpExecArray, _: string) {
          return new Hsla(
            parseInt(execResult[2], 10),
            parseInt(execResult[3], 10) / 100,
            parseInt(execResult[4], 10) / 100,
            parseAlpha(execResult[5]),
          );
        },
      },
      {
        regex: HSVA_REGEX,
        parseFunction: function (execResult: RegExpExecArray, _: string) {
          return new Hsva(
            parseInt(execResult[2], 10),
            parseInt(execResult[3], 10) / 100,
            parseInt(execResult[4], 10) / 100,
            isNaN(parseFloat(execResult[5])) ? 1 : parseFloat(execResult[5]),
          );
        },
      },
      {
        regex: CMYK_REGEX,
        parseFunction: function (execResult: RegExpExecArray, _: string) {
          return new Cmyk(
            Number(execResult[1]) / 100,
            Number(execResult[2]) / 100,
            Number(execResult[3]) / 100,
            Number(execResult[4]) / 100,
          );
        },
      },
      {
        regex: HEX_REGEX,
        parseFunction: function (_: RegExpExecArray, originalValue: string) {
          return originalValue;
        },
      },
    ];

    for (let i = 0; i < stringParsers.length; i++) {
      const parser = stringParsers[i];
      const match = parser.regex.exec(value);
      if (match) {
        return parser.parseFunction(match, value);
      }
    }
    throw new Error(
      `Invalid color string: "${value}". Expected formats: RGBA, HSLA, HSVA, CMYK or HEX.`,
    );
  }

  public static getColorModelByString(color: string): ColorModel | 'INVALID' {
    if (color) {
      color = color.trim().toLowerCase();
      if (HEX_REGEX.test(color)) {
        return 'HEXA';
      } else if (RGBA_REGEX.test(color)) {
        return 'RGBA';
      } else if (HSLA_REGEX.test(color)) {
        return 'HSLA';
      } else if (HSVA_REGEX.test(color)) {
        return 'HSVA';
      } else if (CMYK_REGEX.test(color)) {
        return 'CMYK';
      }
    }
    return 'INVALID';
  }
}
