export const colorPurple = "rgb(43,25,138)";
export const colorPurpleTransparent = "rgba(43,25,138,0)";

export const colorWhite = "rgb(255,255,255)";
export const colorWhiteTransparent = "rgba(255,255,255,0)";

export const colorHeart1 = "#FF0303";
export const colorHeart2 = "#FF8D8D";
export const colorHeart3 = "#FED5D5";

export function popularityToColor(popularity) {
  switch (popularity) {
    case 1:
      return colorHeart1;
    case 2:
      return colorHeart2;
    default:
      return colorHeart3;
  }
}

export const cloudFullWhiteStyle = { stroke: colorPurple, fill: colorWhite };
export const cloudFullPurpleStyle = { stroke: colorWhite, fill: colorPurple };
