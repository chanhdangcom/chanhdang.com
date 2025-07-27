"use client";

import { useState, useEffect } from "react";
import { IMusic } from "@/features/profile/types/music";
import { FavoriteButton } from "./favorite-button";
import { useAudio } from "@/components/music-provider";

import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Heart, Play, Shuffle } from "phosphor-react";
import { AudioItemOrder } from "./audio-item-order";

interface FavoritesListProps {
  userId?: string;
}

interface FavoriteItem {
  _id: string;
  userId: string;
  musicId: string;
  musicData: IMusic;
  createdAt: string;
}

export function FavoritesList({ userId }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handlePlayAudio } = useAudio();

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/favorites?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  if (!userId) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">
          Vui lòng đăng nhập để xem bài hát yêu thích
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

  if (favorites.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Chưa có bài hát yêu thích nào</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div className="mb-16 w-full font-apple" layoutId="favorites">
        <div className="w-full flex-col items-center md:flex-none">
          {/* Header với icon heart */}
          <div className="flex justify-center">
            <div className="mx-auto my-4 flex size-60 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-pink-500 shadow-2xl">
              <Heart
                weight="fill"
                size={80}
                className="text-white"
                fill="white"
              />
            </div>
          </div>

          {/* Title section */}
          <div className="space-y-2 text-6xl">
            <div className="flex items-center justify-center gap-1">
              <div className="text-2xl font-semibold">Bài hát yêu thích</div>
            </div>

            <div className="text-center text-lg text-zinc-500">
              ChanhDang Music
            </div>

            <div className="mx-4 space-y-4">
              <div className="flex w-full justify-between gap-4">
                <div className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-1 font-semibold text-red-500 dark:bg-zinc-900">
                  <Play weight="fill" size={20} />
                  <div className="text-xl">Play All</div>
                </div>

                <div className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-2 font-semibold text-red-500 dark:bg-zinc-900">
                  <Shuffle size={20} />
                  <div className="text-xl">Mix song</div>
                </div>
              </div>
            </div>

            <div className="text-center text-base text-zinc-500">
              <div className="text-balance">
                Tận hưởng bữa tiệc âm nhạc đầy đặc sắc với {favorites.length}{" "}
                bài hát yêu thích
              </div>
            </div>
          </div>
        </div>

        <div className="mx-8 flex items-center justify-center">
          <div className="md:mx-a mt-8 justify-center px-3 md:mt-0 md:max-w-3xl md:justify-center">
            <div className="space-y-4 md:hidden">
              {favorites.map((favorite) => {
                const music = favorite.musicData;

                return (
                  <div key={favorite._id} className="">
                    <div className="flex flex-col justify-center text-black dark:text-white">
                      <div className="flex items-center gap-2">
                        <AudioItemOrder
                          music={music}
                          handlePlay={() => handlePlayAudio(music)}
                          item={
                            <FavoriteButton
                              music={music}
                              userId={userId}
                              size="sm"
                            />
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 hidden w-full md:grid md:grid-cols-3 md:gap-8">
              {favorites.map((favorite) => {
                const music = favorite.musicData;

                return (
                  <div key={favorite._id} className="">
                    <div className="flex flex-col justify-center text-black dark:text-white">
                      <div className="flex items-center gap-2">
                        <AudioItemOrder
                          music={music}
                          handlePlay={() => handlePlayAudio(music)}
                          item={
                            <FavoriteButton
                              music={music}
                              userId={userId}
                              size="sm"
                            />
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
