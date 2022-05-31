import { clamp } from "../../helpers/math";
import { convolute } from "./convolute";

export const brightness = (max: number, percent: number) => {
  const brightnessMul =
    percent > 50
      ? (((percent - 50) / 50) * (max - 1)) / 10 + 1
      : (percent / 50) * 0.6 + 0.4;

  return (input: number) => input * brightnessMul;
};

export const exposure = (percent: number) => {
  const gamma = percent / 100 + 0.5;
  const adjustment = 1 / gamma;

  return (input: number) => Math.pow(input / 255, adjustment) * 255;
};

export const whitebalance = (percent: number) => {
  const adjustment =
    (percent < 50 ? 2 - percent / 50 : 1.125 - percent / 400) * 255;

  return (input: number) => input * (255 / adjustment);
};

export const contrast = (percent: number) => {
  const adjustment = Math.pow(((percent - 50) / 3 + 50) / 50, 2);

  return (input: number) =>
    clamp(0, ((input / 255 - 0.5) * adjustment + 0.5) * 255, 255);
};

export const temparature = (
  redMax: number,
  blueMax: number,
  percent: number
) => {
  const redWeight = percent;
  const blueWeight = 100 - percent;

  const intensity = 0.1;

  const redMul =
    redWeight > 50
      ? ((redWeight - 50) / 50) * (redMax - 1) * intensity + 1
      : (redWeight / 50) * intensity + (1 - intensity);
  const blueMul =
    blueWeight > 50
      ? ((blueWeight - 50) / 50) * (blueMax - 1) * intensity + 1
      : (blueWeight / 50) * intensity + (1 - intensity);

  return (input: number, type: "r" | "g" | "b") =>
    type === "r" ? redMul * input : type === "b" ? blueMul * input : input;
};

export const clarity = (percent: number) => {
  if (percent > 50) {
    const centerWeight = percent / 30 + 1;
    const sideWeight = -(centerWeight - 1) / 4;

    const weights = [
      0,
      sideWeight,
      0,
      sideWeight,
      centerWeight,
      sideWeight,
      0,
      sideWeight,
      0,
    ];

    return (imageData: ImageData) => convolute(imageData, weights);
  } else if (percent < 50) {
    const radius = Math.floor((50 - percent) / 5) + 1;
    const weights = [...Array(radius * radius)].fill(1 / (radius * radius));

    return (imageData: ImageData) => convolute(imageData, weights);
  }
};

export const hsv = (saturation: number, hue: number) => {
  const v = 1;
  const s = Math.pow(2, saturation / 50);
  const h = (((hue + 50) / 100) * 360 + 360) % 360;

  const vsu = v * s * Math.cos((h * Math.PI) / 180),
    vsw = v * s * Math.sin((h * Math.PI) / 180);
  // (result spot)(source spot)
  const rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw,
    rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw,
    rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
  const gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw,
    gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw,
    gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
  const br = 0.299 * v - 0.3 * vsu + 1.25 * vsw,
    bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw,
    bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;

  return (r: number, g: number, b: number) => {
    return [
      rr * r + rg * g + rb * b,
      gr * r + gg * g + gb * b,
      br * r + bg * g + bb * b,
    ];
  };
};
