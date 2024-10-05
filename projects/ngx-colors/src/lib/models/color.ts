import { ColorGroup } from '../interfaces/color-group';
import { Convert } from '../utility/convert';
import { Rgba } from './rgba';

export class PaletteColor {
  public preview: string | undefined;
  public value: Rgba | undefined;
  public childs: Array<PaletteColor> | undefined;
  constructor(color: string | ColorGroup | undefined) {
    if (!color) {
      this.value = undefined;
      this.preview = undefined;
      return;
    }
    if (typeof color == 'string') {
      this.preview = color.toLowerCase();
      this.value = Convert.stringToRgba(color);
      return;
    }
    if (!color.color) {
      this.value = undefined;
      this.preview = undefined;
      return;
    }
    this.preview = color.color.toLowerCase();
    if (color.childs?.length) {
      this.childs = color.childs.map((c) => new PaletteColor(c));
      return;
    }
    this.value = Convert.stringToRgba(color.color);
  }
}
