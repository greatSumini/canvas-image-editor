type Options = {
  image: HTMLImageElement;
  dx: number;
  dy: number;
  width: number;
  height: number;
};

export const CanvasRenderer = (
  ctx: CanvasRenderingContext2D,
  options: Options
) => {
  ctx.imageSmoothingEnabled = false;

  const { image, dx, dy, width, height } = options;
  ctx.drawImage(image, dx, dy, width, height);
  const initialData = ctx.getImageData(dx, dy, width, height);

  const imageData = new ImageData(
    initialData.data,
    initialData.width,
    initialData.height
  );

  return imageData;
};
