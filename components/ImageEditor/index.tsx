import { useEffect } from "react";

import ImageCanvas from "../ImageCanvas";
import Menu from "./Menu";

import { useEditingDatas } from "./useEditingDatas";

const IMAGES = [
  "https://dfmarqni2tgyh.cloudfront.net/upload_images/20220531/demo_small.png",
  "https://dfmarqni2tgyh.cloudfront.net/swapped/20220516/132851_381760_1339.jpg",
  "https://dfmarqni2tgyh.cloudfront.net/upload_images/20220520/k_127767530.jpg",
];

export default function ImageEditor() {
  const {
    datas,
    index: editingIndex,
    currentData,
    move,
    add,
    setOption,
  } = useEditingDatas();

  useEffect(() => {
    add(IMAGES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Menu data={currentData} onChange={setOption} />
      {datas.map((data, index) => (
        <ImageCanvas
          key={data.src}
          {...data}
          isVisible={index === editingIndex}
        />
      ))}
      <button onClick={() => move(-1)}>prev</button>
      index: {editingIndex}
      <button onClick={() => move(+1)}>next</button>
    </>
  );
}
