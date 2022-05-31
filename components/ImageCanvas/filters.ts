import { exposure, hsv, temparature } from "./adjustments";

export const vintage = (
  redBrightnessMax: number,
  blueBrightnessMax: number
) => {
  const _exposure = exposure(55);
  const _temparature = temparature(redBrightnessMax, blueBrightnessMax, 75);

  return (r: number, g: number, b: number) => {
    let _r = r,
      _g = g,
      _b = b;

    // const _brightness = brightness(brightnessMax.current, 40);
    // _r = _brightness(_r);
    // _g = _brightness(_g);
    // _b = _brightness(_b);
    _r = _exposure(_r);
    _g = _exposure(_g);
    _b = _exposure(_b);
    // const _whitebalance = whitebalance(40);
    // _r = _whitebalance(_r);
    // _g = _whitebalance(_g);
    // _b = _whitebalance(_b);

    _r = _temparature(_r, "r");
    _g = _temparature(_g, "g");
    _b = _temparature(_b, "b");

    const hsvResult = hsv(25, 47)(_r, _g, _b);
    _r = hsvResult[0];
    _g = hsvResult[1];
    _b = hsvResult[2];
    return [_r, _g, _b];
  };
};

export const grayscale = () => {
  return (r: number, g: number, b: number) => {
    const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return [v, v, v];
  };
};
