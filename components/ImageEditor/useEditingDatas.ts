import { useState } from "react";

import { clamp } from "../../helpers/math";

export type EditingData = {
  src: string;

  brightness: number;
  exposure: number;
  whitebalance: number;
  contrast: number;
  temparature: number;
};

export const INITIAL_EDITING_DATA: Omit<EditingData, "src"> = {
  brightness: 50,
  exposure: 50,
  whitebalance: 50,
  contrast: 50,
  temparature: 50,
};

export const useEditingDatas = () => {
  const [datas, setDatas] = useState<EditingData[]>([]);
  const [index, setIndex] = useState(0);

  const add = (urls: string[]) => {
    setDatas([
      ...datas,
      ...urls.map((url) => ({ src: url, ...INITIAL_EDITING_DATA })),
    ]);
  };

  const move = (diff: number) => {
    setIndex((prev) => Math.min(Math.max(0, prev + diff), datas.length - 1));
  };

  const setOption = (input: Partial<Omit<EditingData, "src">>) => {
    setDatas([
      ...datas.slice(0, index),
      {
        ...currentData,
        brightness: clamp(0, input.brightness, 100) ?? currentData.brightness,
        exposure: clamp(0, input.exposure, 100) ?? currentData.exposure,
        whitebalance:
          clamp(0, input.whitebalance, 100) ?? currentData.whitebalance,
        contrast: clamp(0, input.contrast, 100) ?? currentData.contrast,
        temparature:
          clamp(0, input.temparature, 100) ?? currentData.temparature,
      },
      ...datas.slice(index + 1),
    ]);
  };

  const currentData = datas.length > 0 ? datas[index] : null;

  return { datas, index, currentData, move, add, setOption };
};
