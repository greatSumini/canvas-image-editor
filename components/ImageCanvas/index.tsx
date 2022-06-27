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
import { CanvasRenderer } from "./canvas";
import { grayscale, vintage } from "./filters";

const WIDTH = 1120;
const HEIGHT = 770;
const CANVAS_IMAGE_SIZE = 370;

type Props = EditingData & {
  isVisible: boolean;
};

export default function ImageCanvas({ src, isVisible, ...options }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>();
  const downloadCanvasRef = useRef<HTMLCanvasElement>();
  const ctx = useRef<CanvasRenderingContext2D>();

  const renderData = useRef<ImageData>();

  const brightnessMax = useRef<number>();
  const redBrightnessMax = useRef<number>();
  const blueBrightnessMax = useRef<number>();

  const scale = useRef<number>();
  const dx = useRef<number>();
  const dy = useRef<number>();

  useEffect(() => {
    loadImage(src, init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const loadImage = (
    url: string,
    onLoad: (image: HTMLImageElement) => void
  ) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      onLoad(image);
    };
    image.src = url;
  };

  const init = (image: HTMLImageElement) => {
    const { current: canvas } = canvasRef;

    scale.current = image.naturalWidth / CANVAS_IMAGE_SIZE;

    // const scale = image.naturalWidth / CANVAS_IMAGE_SIZE;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const _width = CANVAS_IMAGE_SIZE;
    const _height = image.naturalHeight / scale.current;
    const _dx = (WIDTH - _width) / 2;
    const _dy = (HEIGHT - _height) / 2;

    dx.current = _dx;
    dy.current = _dy;

    ctx.current = canvas.getContext("2d");

    const _imageData = CanvasRenderer(ctx.current, {
      image,
      width: _width,
      height: _height,
      dx: _dx,
      dy: _dy,
    });

    setBrightnessMax(_imageData.data);

    renderData.current = _imageData;

    renderImage(ctx.current, _imageData);
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

  const renderImage = (
    ctx: CanvasRenderingContext2D,
    inputData: ImageData,
    loc?: { dx: number; dy: number }
  ) => {
    if (!renderData.current) {
      return;
    }

    let _imageData = new ImageData(
      new Uint8ClampedArray(inputData.data),
      inputData.width,
      inputData.height
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

    const applyVintage = vintage(
      redBrightnessMax.current,
      blueBrightnessMax.current
    );
    const applyGrayscale = grayscale();

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

    const { data } = _imageData;

    for (let i = 0; i < data.length; i += 4) {
      if (isUpdated.brightness) {
        data[i] = applyBrightness(data[i]);
        data[i + 1] = applyBrightness(data[i + 1]);
        data[i + 2] = applyBrightness(data[i + 2]);
      }
      if (isUpdated.exposure) {
        data[i] = applyExposure(data[i]);
        data[i + 1] = applyExposure(data[i + 1]);
        data[i + 2] = applyExposure(data[i + 2]);
      }
      if (isUpdated.whitebalance) {
        data[i] = applyWhitebalance(data[i]);
        data[i + 1] = applyWhitebalance(data[i + 1]);
        data[i + 2] = applyWhitebalance(data[i + 2]);
      }
      if (isUpdated.contrast) {
        data[i] = applyContrast(data[i]);
        data[i + 1] = applyContrast(data[i + 1]);
        data[i + 2] = applyContrast(data[i + 2]);
      }
      if (isUpdated.temparature) {
        data[i] = applyTemparature(data[i], "r");
        data[i + 2] = applyTemparature(data[i + 2], "b");
      }
      if (isUpdated.hsv) {
        const [r, g, b] = applyHsv(data[i], data[i + 1], data[i + 2]);
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }

      if (options.filter === "vintage") {
        const [r, g, b] = applyVintage(data[i], data[i + 1], data[i + 2]);
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      } else if (options.filter === "grayscale") {
        const [r, g, b] = applyGrayscale(data[i], data[i + 1], data[i + 2]);
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
    }

    const _dx = loc?.dx ?? dx.current;
    const _dy = loc?.dy ?? dy.current;
    ctx.putImageData(_imageData, _dx, _dy);
  };

  const download = () => {
    loadImage(src, (image) => {
      const { current: canvas } = downloadCanvasRef;

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const _ctx = canvas.getContext("2d");

      const _imageData = CanvasRenderer(_ctx, {
        image,
        width: canvas.width,
        height: canvas.height,
        dx: 0,
        dy: 0,
      });

      renderImage(_ctx, _imageData, { dx: 0, dy: 0 });

      var link = document.createElement("a");
      link.download = "filename.png";
      link.href = downloadCanvasRef.current.toDataURL();
      link.click();
    });
  };

  useEffect(() => {
    renderImage(ctx.current, renderData.current);
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
    <>
      <button onClick={download}>download</button>
      <canvas
        ref={canvasRef}
        style={{
          display: isVisible ? "flex" : "none",
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          background: "#333",
        }}
      />
      <canvas ref={downloadCanvasRef} style={{ display: "none" }} />
    </>
  );
}
