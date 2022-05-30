import { useRef, useEffect } from "react";

import { EditingData } from "../ImageEditor/useEditingDatas";

const DISPLAY_SCALE = 0.1;

const WIDTH = 11200;
const HEIGHT = 7700;
const CANVAS_IMAGE_SIZE = 3700;

type Props = EditingData & {
  isVisible: boolean;
};

export default function ImageCanvas({ src, isVisible, ...options }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>();
  const ctx = useRef<CanvasRenderingContext2D>();

  const imageData = useRef<ImageData>();

  const dx = useRef<number>();
  const dy = useRef<number>();
  const width = useRef<number>();
  const height = useRef<number>();

  useEffect(() => {
    console.log("hi");
    init(src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const init = (url: string) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      const { current: canvas } = canvasRef;

      canvas.width = WIDTH;
      canvas.height = HEIGHT;

      dx.current = (WIDTH - CANVAS_IMAGE_SIZE) / 2;
      dy.current = (HEIGHT - CANVAS_IMAGE_SIZE) / 2;
      width.current = CANVAS_IMAGE_SIZE;
      height.current =
        (image.naturalHeight * CANVAS_IMAGE_SIZE) / image.naturalWidth;

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
    };
    image.src = url;
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
    if (options.brightness != null) {
      _imageData = brightness(_imageData, options.brightness);
    }

    ctx.current.putImageData(_imageData, dx.current, dy.current);
  };

  const brightness = (_imageData: ImageData, percent: number) => {
    let dpc = 255;
    for (let i = 0; i < imageData.current.data.length; i += 1) {
      const color = imageData.current.data[i];
      if (color < dpc && color > 100) {
        dpc = color;
      }
    }
    const max = 255 / dpc;

    const brightnessMul =
      percent > 50 ? ((percent - 50) / 50) * (max - 1) + 1 : percent / 50;

    for (let i = 0; i < _imageData.data.length; i += 1) {
      _imageData.data[i] = _imageData.data[i] * brightnessMul;
    }

    return _imageData;
  };

  useEffect(() => {
    renderImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.brightness]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: isVisible ? "flex" : "none",
        width: `${WIDTH * DISPLAY_SCALE}px`,
        height: `${HEIGHT * DISPLAY_SCALE}px`,
        background: "#333",
      }}
    />
  );
}
