"use client";

import { useState, useEffect } from "react";
import { useAudio } from "@/components/music-provider";
import { motion } from "framer-motion";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { AudioItemOrder } from "../component/audio-item-order";
import { DotsThreeVertical } from "@phosphor-icons/react/dist/ssr";

interface LibraryTracksListProps {
  userId?: string;
}

export function LibraryTracksList({ userId }: LibraryTracksListProps) {
  const [tracks, setTracks] = useState<IMusic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handlePlayAudio } = useAudio();

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchLibraryTracks = async () => {
      try {
        const response = await fetch(
          `/api/library?userId=${userId}&type=music`
        );
        if (response.ok) {
          const data = await response.json();
          const normalized = data
            .map((entry: { resourceData?: IMusic }) => entry.resourceData)
            .filter(Boolean);
          setTracks(normalized);
        }
      } catch (error) {
        console.error("Error fetching library tracks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryTracks();
  }, [userId]);

  if (!userId) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">
          Vui lòng đăng nhập để xem Library của bạn
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Library của bạn chưa có bài hát nào</p>
      </div>
    );
  }

  const Data = () => {
    return (
      <motion.div className="mb-16 w-full font-apple" layoutId="library-tracks">
        <div className="">
          <div className="mt-8 w-full space-y-4">
            {tracks.map((music) => {
              return (
                <div key={music.id} className="">
                  <div className="flex flex-col text-black dark:text-white">
                    <div className="">
                      <AudioItemOrder
                        music={music}
                        handlePlay={() => handlePlayAudio(music)}
                        className="w-full"
                        date={
                          music.createdAt
                            ? new Date(music.createdAt as Date).toISOString()
                            : undefined
                        }
                        item={<DotsThreeVertical size={20} weight="bold" />}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Data />
    </>
  );
}
