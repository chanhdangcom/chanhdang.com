import { type BlocksContent } from "@strapi/blocks-react-renderer";

export type IPost = {
  documentId: string;
  title: string;
  description: string;
  content_blocks: BlocksContent;
  createdAt: string;
  slug: string;
  cover: {
    formats: {
      medium: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
};
