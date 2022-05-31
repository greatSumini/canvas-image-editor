import { useRef, useEffect } from "react";

import { EditingData } from "../ImageEditor/useEditingDatas";

import { brightness, contrast, exposure, whitebalance } from "./adjustments";

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

      dx.current = ((WIDTH - CANVAS_IMAGE_SIZE) / 2) * scale;
      dy.current = ((HEIGHT - CANVAS_IMAGE_SIZE) / 2) * scale;
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
    let dpc = 255;
    for (let i = 0; i < data.length; i += 1) {
      const color = data[i];
      if (color < dpc && color > 100) {
        dpc = color;
      }
    }
    brightnessMax.current = 255 / dpc;
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

    const isUpdated = {
      brightness: options.brightness != null && options.brightness !== 50,
      exposure: options.exposure != null && options.exposure !== 50,
      whitebalance: options.whitebalance != null && options.whitebalance !== 50,
      contrast: options.contrast != null && options.contrast !== 50,
    };

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
    }

    ctx.current.putImageData(_imageData, dx.current, dy.current);
  };

  useEffect(() => {
    renderImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.brightness,
    options.exposure,
    options.whitebalance,
    options.contrast,
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
