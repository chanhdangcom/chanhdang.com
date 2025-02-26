import { IPost } from "@/features/blog/types";
import qs from "qs";

export async function getPosts() {
  const queryParams = qs.stringify(
    {
      populate: {
        cover: true,
      },
      sort: ["updatedAt:desc"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  const data = await fetch(
    `https://api.quaric.com/api/articles/custom?${queryParams}`,
    {
      method: "GET",
    }
  );

  const jsonData = await data.json();
  const posts = (await jsonData.data) as IPost[];

  // console.log("posts:", posts);

  return posts;
}
