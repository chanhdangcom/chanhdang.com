import { BorderPro } from "./component/border-pro";

export default function Page() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <>
        <BorderPro className="rounded-xl">
          <img
            src="/img/avatar.jpeg"
            alt="avt"
            className="size-40 rounded-xl"
          />
        </BorderPro>
      </>
    </div>
  );
}
