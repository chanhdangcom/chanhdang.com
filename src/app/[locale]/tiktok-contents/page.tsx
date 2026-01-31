import { FontStyle } from "./component/font-style";

export default function Page() {
  return (
    <div className="m-16 flex items-center justify-start gap-4">
      <FontStyle title="NCDANG" />

      <FontStyle
        title="DANG"
        className="text-sm text-red-500 hover:underline"
      />

      <FontStyle title="CHANHDANG" className="text-green-500" />
    </div>
  );
}
