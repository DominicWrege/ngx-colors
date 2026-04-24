export class NgxColorsColor {
  preview = "";
  variants: string[] = [];
  constructor(params?: { preview: string; variants: string[] }) {
    if (params) {
      this.preview = params.preview;
      this.variants = params.variants;
    }
  }
}
