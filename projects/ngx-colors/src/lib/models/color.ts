import { ColorGroup } from '../interfaces/color-group';
import { Convert } from '../utility/convert';
import { Rgba } from './rgba';

export class PaletteColor {
  public preview: string;
  public value: Rgba | undefined;
  public childs: Array<PaletteColor> | undefined;
  constructor(color: string | ColorGroup) {
    if (typeof color == 'string') {
      this.preview = color.toLowerCase();
      this.value = Convert.stringToRgba(color);
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
