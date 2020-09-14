const colorPallete = ["#C4B7CB", "#BBC7CE", "#BFEDEF", "#98E2C6", "#F3B61F", "#BBD8B3", "#EEF4ED",
  "#8DA9C4", "#F7A9A8", "#E5C3D1", "#A2D729", "#D6F599", "#FA824C", "#AAEFDF", "#9EE37D"]

export function randomColor() {
  return colorPallete[Math.floor(Math.random() * colorPallete.length)];
}