import { useRef, useEffect } from "react";

import { EditingData } from "../ImageEditor/useEditingDatas";

import {
  brightness,
  clarity,
  contrast,
  exposure,
  hsv,
  temparature,
  whitebalance,
} from "./adjustments";

const WIDTH = 1120;
const HEIGHT = 770;
const CANVAS_IMAGE_SIZE = 370;

type Props = EditingData & {
  isVisible: boolean;
};

export default function ImageCanvas({ src, isVisible, ...options }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>();
  const ctx = useRef<CanvasRenderingContext2D>();

  const imageData = useRef<ImageData>();
  const brightnessMax = useRef<number>();
  const redBrightnessMax = useRef<number>();
  const blueBrightnessMax = useRef<number>();

  const dx = useRef<number>();
  const dy = useRef<number>();
  const width = useRef<number>();
  const height = useRef<number>();

  useEffect(() => {
    init(src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const init = (url: string) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      const { current: canvas } = canvasRef;

      const scale = image.naturalWidth / CANVAS_IMAGE_SIZE;

      canvas.width = WIDTH * scale;
      canvas.height = HEIGHT * scale;

      dx.current = (WIDTH * scale - image.naturalWidth) / 2;
      dy.current = (HEIGHT * scale - image.naturalHeight) / 2;
      width.current = image.naturalWidth;
      height.current = image.naturalHeight;

      ctx.current = canvas.getContext("2d");

      ctx.current.imageSmoothingEnabled = false;
      ctx.current.drawImage(
        image,
        dx.current,
        dy.current,
        width.current,
        height.current
      );
      const initialData = ctx.current.getImageData(
        dx.current,
        dy.current,
        width.current,
        height.current
      );
      imageData.current = new ImageData(
        initialData.data,
        initialData.width,
        initialData.height
      );
      setBrightnessMax(initialData.data);
    };
    image.src = url;
  };

  const setBrightnessMax = (data: Uint8ClampedArray) => {
    let min = 255;
    let redMin = 255;
    let blueMin = 255;

    for (let i = 0; i < data.length; i += 4) {
      min = Math.min(min, data[i], data[i + 1], data[i + 2]);
      redMin = Math.min(redMin, data[i]);
      blueMin = Math.min(blueMin, data[i + 2]);
    }

    brightnessMax.current = 255 / Math.max(100, min);
    redBrightnessMax.current = 255 / Math.max(100, redMin);
    blueBrightnessMax.current = 255 / Math.max(100, blueMin);
  };

  const renderImage = () => {
    if (!imageData.current) {
      return;
    }

    let _imageData = new ImageData(
      new Uint8ClampedArray(imageData.current.data),
      imageData.current.width,
      imageData.current.height
    );

    const applyBrightness = brightness(
      brightnessMax.current,
      options.brightness
    );
    const applyExposure = exposure(options.exposure);
    const applyWhitebalance = whitebalance(options.whitebalance);
    const applyContrast = contrast(options.contrast);
    const applyTemparature = temparature(
      redBrightnessMax.current,
      blueBrightnessMax.current,
      options.temparature
    );
    const applyHsv = hsv(options.saturation, options.hue);

    const applyVintage = (r: number, g: number, b: number) => {
      let _r = r,
        _g = g,
        _b = b;

      // const _brightness = brightness(brightnessMax.current, 40);
      // _r = _brightness(_r);
      // _g = _brightness(_g);
      // _b = _brightness(_b);
      const _exposure = exposure(55);
      _r = _exposure(_r);
      _g = _exposure(_g);
      _b = _exposure(_b);
      // const _whitebalance = whitebalance(40);
      // _r = _whitebalance(_r);
      // _g = _whitebalance(_g);
      // _b = _whitebalance(_b);

      const _temparature = temparature(
        redBrightnessMax.current,
        blueBrightnessMax.current,
        75
      );
      _r = _temparature(_r, "r");
      _g = _temparature(_g, "g");
      _b = _temparature(_b, "b");

      const hsvResult = hsv(25, 47)(_r, _g, _b);
      _r = hsvResult[0];
      _g = hsvResult[1];
      _b = hsvResult[2];

      return [_r, _g, _b];
    };

    const isUpdated = {
      clarity: options.clarity != null && options.clarity !== 50,
      brightness: options.brightness != null && options.brightness !== 50,
      exposure: options.exposure != null && options.exposure !== 50,
      whitebalance: options.whitebalance != null && options.whitebalance !== 50,
      contrast: options.contrast != null && options.contrast !== 50,
      temparature: options.temparature != null && options.temparature !== 50,
      hsv:
        (options.hue != null && options.hue !== 50) ||
        (options.saturation != null && options.saturation !== 50),
    };

    if (isUpdated.clarity) {
      clarity(options.clarity)(_imageData);
    }

    for (let i = 0; i < _imageData.data.length; i += 4) {
      if (isUpdated.brightness) {
        _imageData.data[i] = applyBrightness(_imageData.data[i]);
        _imageData.data[i + 1] = applyBrightness(_imageData.data[i + 1]);
        _imageData.data[i + 2] = applyBrightness(_imageData.data[i + 2]);
      }
      if (isUpdated.exposure) {
        _imageData.data[i] = applyExposure(_imageData.data[i]);
        _imageData.data[i + 1] = applyExposure(_imageData.data[i + 1]);
        _imageData.data[i + 2] = applyExposure(_imageData.data[i + 2]);
      }
      if (isUpdated.whitebalance) {
        _imageData.data[i] = applyWhitebalance(_imageData.data[i]);
        _imageData.data[i + 1] = applyWhitebalance(_imageData.data[i + 1]);
        _imageData.data[i + 2] = applyWhitebalance(_imageData.data[i + 2]);
      }
      if (isUpdated.contrast) {
        _imageData.data[i] = applyContrast(_imageData.data[i]);
        _imageData.data[i + 1] = applyContrast(_imageData.data[i + 1]);
        _imageData.data[i + 2] = applyContrast(_imageData.data[i + 2]);
      }
      if (isUpdated.temparature) {
        _imageData.data[i] = applyTemparature(_imageData.data[i], "r");
        _imageData.data[i + 2] = applyTemparature(_imageData.data[i + 2], "b");
      }
      if (isUpdated.hsv) {
        const [r, g, b] = applyHsv(
          _imageData.data[i],
          _imageData.data[i + 1],
          _imageData.data[i + 2]
        );
        _imageData.data[i] = r;
        _imageData.data[i + 1] = g;
        _imageData.data[i + 2] = b;
      }

      if (options.filter === "vintage") {
        const [r, g, b] = applyVintage(
          _imageData.data[i],
          _imageData.data[i + 1],
          _imageData.data[i + 2]
        );
        _imageData.data[i] = r;
        _imageData.data[i + 1] = g;
        _imageData.data[i + 2] = b;
      }
    }

    ctx.current.putImageData(_imageData, dx.current, dy.current);
  };

  useEffect(() => {
    renderImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.clarity,
    options.brightness,
    options.exposure,
    options.whitebalance,
    options.contrast,
    options.temparature,
    options.saturation,
    options.hue,
    options.filter,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: isVisible ? "flex" : "none",
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        background: "#333",
      }}
    />
  );
}
