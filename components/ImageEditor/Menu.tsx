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
    <div style={{ maxWidth: "540px" }}>
      밝기조정
      <Slider
        defaultValue={50}
        min={0}
        max={100}
        onAfterChange={(brightness: number) =>
          onChange({ ...data, brightness })
        }
      />
    </div>
  );
}
