import { Rgba } from '../models/rgba';
export type Changes = {
  value: Rgba | null | undefined;
  origin: 'text-input' | 'color-picker' | 'trigger' | 'palette';
};
