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

  const diffBrightness = (diff: number) => {
    onChange({ ...data, brightness: data.brightness + diff });
  };

  return (
    <div>
      밝기조정
      <ul>
        <li>
          <button onClick={() => diffBrightness(+5)}>up</button>
          {data.brightness}
          <button onClick={() => diffBrightness(-5)}>down</button>
        </li>
      </ul>
    </div>
  );
}
