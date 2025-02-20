import React from "react";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

type IProps = {
  contentBlocks: BlocksContent;
};

export const StrapiBlocksRenderer = ({ contentBlocks }: IProps) => {
  return (
    <BlocksRenderer
      content={contentBlocks}
      blocks={{
        code: ({ plainText }) => {
          const embedData = JSON.parse(plainText || "[]");
          const [embedType] = embedData;

          switch (embedType) {
            case "CLOUDINARY_VIDEO_EMBED": {
              const [, embedLink, embedTitle] = embedData;
              if (!embedLink) return null;
              return (
                <iframe
                  src={embedLink}
                  title={embedTitle}
                  width="640"
                  height="360"
                  style={{
                    height: "auto",
                    width: "100%",
                    aspectRatio: 640 / 360,
                  }}
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              );
            }

            case "YOUTUBE": {
              const [, videoId, videoTitle] = embedData;
              return (
                <iframe
                  width="640"
                  height="360"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={videoTitle}
                  style={{
                    height: "auto",
                    width: "100%",
                    aspectRatio: 640 / 360,
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              );
            }

            default: {
              return null;
            }
          }
        },
      }}
    />
  );
};
