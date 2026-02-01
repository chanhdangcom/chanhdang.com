import { NewReleasePage } from "../new-release-page";

// Server component: chỉ render phần carousels
export function SearchSection() {
  return (
    <div
      id="search-carousels"
      className="absolute top-12 z-10 w-full transition-opacity duration-200"
    >
      <NewReleasePage searchPage />
    </div>
  );
}
