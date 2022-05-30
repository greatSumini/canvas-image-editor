import { useState } from "react";

export type EditingData = {
  src: string;

  brightness: number;
  exposure: number;
  whitebalance: number;
};

export const INITIAL_EDITING_DATA: Omit<EditingData, "src"> = {
  brightness: 50,
  exposure: 50,
  whitebalance: 50,
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
      },
      ...datas.slice(index + 1),
    ]);
  };

  const currentData = datas.length > 0 ? datas[index] : null;

  return { datas, index, currentData, move, add, setOption };
};

const clamp = (min: number, input: number, max: number) =>
  input != null ? Math.min(max, Math.max(min, input)) : null;
