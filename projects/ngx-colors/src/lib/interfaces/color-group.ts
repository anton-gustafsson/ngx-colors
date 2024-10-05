export interface ColorGroup {
  color: string | undefined;
  childs?: Array<string | ColorGroup | undefined>;
}
