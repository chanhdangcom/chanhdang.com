import { type BlocksContent } from "@strapi/blocks-react-renderer";

export type IPost = {
  documentId: string;
  title: string;
  description: string;
  content_blocks: BlocksContent;
  slug: string;
};
