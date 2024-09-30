import { PaletteColor } from '../models/color';

export type Palette = {
  back?: Palette;
  list: Array<PaletteColor>;
};
