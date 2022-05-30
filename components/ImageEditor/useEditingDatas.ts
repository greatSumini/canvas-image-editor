import { useState } from "react";

export type EditingData = {
  src: string;

  /** [0, 100] */
  brightness: number;
};

export const INITIAL_EDITING_DATA: Omit<EditingData, "src"> = {
  brightness: 50,
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
        brightness:
          input.brightness != null
            ? Math.min(100, Math.max(0, input.brightness))
            : currentData.brightness,
      },
      ...datas.slice(index + 1),
    ]);
  };

  const currentData = datas.length > 0 ? datas[index] : null;

  return { datas, index, currentData, move, add, setOption };
};
