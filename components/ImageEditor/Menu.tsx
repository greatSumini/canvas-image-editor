import { Slider } from "antd";

import { EditingData } from "./useEditingDatas";

type MenuData = Omit<EditingData, "src">;

type ImageEditorMenuProps = {
  data: MenuData;
  onChange: (data: MenuData) => void;
};

export default function ImageEditorMenu({
  data,
  onChange,
}: ImageEditorMenuProps) {
  if (!data) {
    return null;
  }

  return (
    <>
      <div style={{ maxWidth: "540px" }}>
        선명도
        <Slider
          defaultValue={50}
          min={0}
          max={100}
          onAfterChange={(clarity: number) => onChange({ ...data, clarity })}
        />
      </div>
      <div style={{ maxWidth: "540px" }}>
        노출
        <Slider
          defaultValue={50}
          min={0}
          max={100}
          onAfterChange={(exposure: number) => onChange({ ...data, exposure })}
        />
      </div>
      <div style={{ maxWidth: "540px" }}>
        밝기
        <Slider
          defaultValue={50}
          min={0}
          max={100}
          onAfterChange={(brightness: number) =>
            onChange({ ...data, brightness })
          }
        />
      </div>
      <div style={{ maxWidth: "540px" }}>
        화이트밸런스
        <Slider
          defaultValue={50}
          min={0}
          max={100}
          onAfterChange={(whitebalance: number) =>
            onChange({ ...data, whitebalance })
          }
        />
      </div>
      <div style={{ maxWidth: "540px" }}>
        대비
        <Slider
          defaultValue={50}
          min={0}
          max={100}
          onAfterChange={(contrast: number) => onChange({ ...data, contrast })}
        />
      </div>
      <div style={{ maxWidth: "540px" }}>
        색온도
        <Slider
          defaultValue={50}
          min={0}
          max={100}
          onAfterChange={(temparature: number) =>
            onChange({ ...data, temparature })
          }
        />
      </div>
    </>
  );
}
