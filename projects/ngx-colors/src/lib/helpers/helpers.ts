import { ColorFormats } from "../enums/formats";

export function isDescendantOrSame(nodeParent: any, nodeTarget: any): boolean {
  return (
    nodeParent == nodeTarget ||
    Array.from(nodeParent.childNodes).some((c) =>
      isDescendantOrSame(c, nodeTarget),
    )
  );
}
export function getFormat(format: string): ColorFormats | undefined {
  switch (format) {
    case "cmyk":
      return ColorFormats.CMYK;
    case "rgba":
      return ColorFormats.RGBA;
    case "hsla":
      return ColorFormats.HSLA;
    case "hex":
      return ColorFormats.HEX;
  }
  return undefined;
}
