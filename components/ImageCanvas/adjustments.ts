import { clamp } from "../../helpers/math";

export const brightness = (max: number, percent: number) => {
  const brightnessMul =
    percent > 50
      ? ((percent - 50) / 50) * (max - 1) + 1
      : (percent / 50) * 0.8 + 0.2;

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
