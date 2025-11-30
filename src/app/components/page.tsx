import { ComponentList } from "../[locale]/features/profile /component-list";
import { Footer } from "../[locale]/features/profile /footer";
import { Header } from "../[locale]/features/profile /header";

export default function Page() {
  return (
    <div>
      <div className="fixed left-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:left-48" />
      <div className="fixed right-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:right-48" />

      <div className="mx-0 border border-zinc-300 p-2 dark:border-zinc-900 md:mx-48">
        <Header />
      </div>

      <div className="mt-6">
        <ComponentList />
      </div>

      <Footer />
    </div>
  );
}
