"use client";
import { useState, useEffect, useCallback } from "react";
import { HeaderMusicPage } from "./header-music-page";
import { Button } from "@/components/ui/button";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { ISingerItem } from "./type/singer";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useUser } from "@/hooks/use-user";
import { usePermissions } from "@/hooks/use-permissions";
import { MenuBar } from "./menu-bar";

export default function AddMusicForm() {
  const { user } = useUser();
  const { role } = usePermissions();
  const isAdmin = role === "admin";
  const isRegularUser = role === "user";

  const [form, setForm] = useState({
    title: "",
    singer: "",
    cover: "",
    audio: "",
    youtube: "",
    content: "",
    type: "",
    topic: "",
    srt: "",
    beat: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Singer selection states (only for admin)
  const [singers, setSingers] = useState<ISingerItem[]>([]);
  const [selectedSingerId, setSelectedSingerId] = useState("");
  const [useExistingSinger, setUseExistingSinger] = useState(false);

  // User's artist profile state
  const [userArtistProfile, setUserArtistProfile] =
    useState<ISingerItem | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userMusics, setUserMusics] = useState<IMusic[]>([]);
  const [adminMusics, setAdminMusics] = useState<IMusic[]>([]);
  const [selectedMusicId, setSelectedMusicId] = useState<string>("");
  const [hasManualTopic, setHasManualTopic] = useState(false);
  const [isSuggestingTopic, setIsSuggestingTopic] = useState(false);
  const resetFormState = useCallback(() => {
    setForm({
      title: "",
      singer: "",
      cover: "",
      audio: "",
      youtube: "",
      content: "",
      type: "",
      topic: "",
      srt: "",
      beat: "",
    });
    setFile(null);
    setImageFile(null);
    setSrtFile(null);
    setBeatFile(null);
    setSelectedSingerId("");
    setUseExistingSinger(false);
    setSelectedMusicId("");
    setHasManualTopic(false);
    setIsSuggestingTopic(false);
  }, []);

  const fetchPresignedUrl = useCallback(async (file: File) => {
    const presignedRes = await fetch(
      `/api/upload-music?fileName=${encodeURIComponent(
        file.name
      )}&contentType=${encodeURIComponent(
        file.type || "application/octet-stream"
      )}`
    );
    if (!presignedRes.ok) {
      const errorData = await presignedRes.json().catch(() => ({}));
      throw new Error(errorData.error || "Unknown error");
    }
    const presignedData = await presignedRes.json();
    if (presignedData.error) {
      throw new Error(presignedData.error);
    }
    return presignedData as { presignedUrl: string; publicUrl: string };
  }, []);

  const uploadFileToR2 = useCallback(
    async (file: File, errorPrefix: string) => {
      const { presignedUrl, publicUrl } = await fetchPresignedUrl(file);
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(`${errorPrefix} ${errorText}`);
      }
      return publicUrl;
    },
    [fetchPresignedUrl]
  );

  const fetchUserArtistProfile = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingProfile(true);
    try {
      // Get all singers and find the one created by this user
      const response = await fetch("/api/singers");
      const singers = await response.json();

      // Normalize user ID for comparison
      const userId = user.id;
      const userIdString = String(userId).trim();

      const userProfile = singers.find((singer: ISingerItem) => {
        if (!singer.addedBy) return false;
        const addedByValue = singer.addedBy;
        const addedByString = String(addedByValue).trim();

        return (
          addedByString === userIdString ||
          addedByValue === userId ||
          addedByValue === userIdString ||
          addedByString.toLowerCase() === userIdString.toLowerCase()
        );
      });

      if (userProfile) {
        setUserArtistProfile(userProfile);
        // Fetch musics from the profile
        if (userProfile._id || userProfile.id) {
          const musicsRes = await fetch(
            `/api/singers/${userProfile._id || userProfile.id}/musics`
          );
          const musicsData = await musicsRes.json();
          setUserMusics(musicsData || []);
        }
      } else {
        // User doesn't have a profile yet, will create automatically on submit
        setUserArtistProfile(null);
        setUserMusics([]);
      }
    } catch (error) {
      console.error("Error fetching user artist profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user?.id]);

  const fetchAdminMusics = useCallback(async () => {
    try {
      const response = await fetch("/api/musics");
      if (!response.ok) return;
      const musicsData = await response.json();
      setAdminMusics(Array.isArray(musicsData) ? musicsData : []);
    } catch (error) {
      console.error("Error fetching admin musics:", error);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "topic") {
      setHasManualTopic(value.trim().length > 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // For regular users: ensure they have a singer profile
    let finalUserArtistProfile = userArtistProfile;
    if (isRegularUser && !userArtistProfile) {
      // Try to create singer profile automatically
      try {
        const profileRes = await fetch("/api/singers/create-artist-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            singer: user?.displayName || user?.username || "Unknown Artist",
            cover: user?.avatarUrl || form.cover || "",
          }),
        });

        const profileData = await profileRes.json();
        if (profileData.success && profileData.singer) {
          // Use the profile object directly from API response (new or existing)
          finalUserArtistProfile = profileData.singer;
          // Also update state for UI
          setUserArtistProfile(profileData.singer);
          // If it's an existing profile, silently continue (no error message)
        } else {
          setMessage(
            profileData.error ||
              "Failed to create singer profile. Please try again!"
          );
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error creating singer profile:", error);
        setMessage("Failed to create singer profile. Please try again!");
        setIsLoading(false);
        return;
      }
    }

    // Admin validation: if using an existing singer, one singer must be selected
    if (isAdmin && useExistingSinger && !selectedSingerId) {
      setMessage("Please select a singer from the list!");
      setIsLoading(false);
      return;
    }

    // Admin validation: if not using an existing singer, singer name is required
    if (isAdmin && !useExistingSinger && !form.singer) {
      setMessage("Please enter the singer name!");
      setIsLoading(false);
      return;
    }

    // Validation: topic and genre are required
    if (!form.topic.trim()) {
      setMessage("Please enter a topic!");
      setIsLoading(false);
      return;
    }

    if (!form.type.trim()) {
      setMessage("Please select a genre!");
      setIsLoading(false);
      return;
    }

    try {
      let audioUrl = form.audio;
      let coverUrl = form.cover;
      let srtUrl = form.srt;
      let beatUrl = form.beat;

      if (file) {
        audioUrl = await uploadFileToR2(file, "Failed to upload mp3!");
      }

      if (imageFile) {
        coverUrl = await uploadFileToR2(imageFile, "Failed to upload image!");
      }

      if (srtFile) {
        srtUrl = await uploadFileToR2(srtFile, "Failed to upload SRT file!");
      }

      if (beatFile) {
        beatUrl = await uploadFileToR2(beatFile, "Failed to upload beat file!");
      }

      // For regular users: use their singer profile
      let targetSingerId: string | null = null;

      if (isRegularUser) {
        if (!finalUserArtistProfile) {
          setMessage("Your singer profile was not found. Please try again!");
          setIsLoading(false);
          return;
        }
        targetSingerId =
          finalUserArtistProfile._id || finalUserArtistProfile.id || null;
        if (!targetSingerId) {
          setMessage("Error: singer profile ID not found!");
          setIsLoading(false);
          return;
        }
      } else if (isAdmin) {
        // Admin validation
        if (
          useExistingSinger &&
          (!selectedSingerId || selectedSingerId.trim() === "")
        ) {
          setMessage("Please select a singer from the list!");
          setIsLoading(false);
          return;
        }

        if (!useExistingSinger && !form.singer.trim()) {
          setMessage(
            "Please enter a singer name or choose an existing singer!"
          );
          setIsLoading(false);
          return;
        }

        if (useExistingSinger && selectedSingerId) {
          targetSingerId = selectedSingerId;
        }
      }

      // Submit song data
      const bodyData = {
        ...form,
        audio: audioUrl,
        cover: coverUrl,
        srt: srtUrl,
        beat: beatUrl,
        // For regular users, set singer name from their profile
        singer:
          isRegularUser && finalUserArtistProfile
            ? finalUserArtistProfile.singer
            : form.singer,
      };

      let res, data;

      // Regular users: always add to their singer profile
      // Admin: add to selected singer or the general musics collection
      if (targetSingerId) {
        // Add to singer profile
        console.log(
          "Sending to API /api/singers/" + targetSingerId + "/musics:",
          bodyData
        );

        res = await fetch(`/api/singers/${targetSingerId}/musics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });
        data = await res.json();
        console.log("Response from /api/singers/[id]/musics:", data);

        // Check if response is unsuccessful
        if (!res.ok) {
          setMessage(
            "Something went wrong! " + (data.error || "Unknown error")
          );
          setIsLoading(false);
          return;
        }
      } else {
        // Admin: Add to general musics collection (when no singer is selected)
        console.log("Sending to API /api/musics:", bodyData);
        res = await fetch("/api/musics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });
        data = await res.json();
        console.log("Response from /api/musics:", data);

        // Check if response is unsuccessful
        if (!res.ok) {
          setMessage(
            "Something went wrong! " + (data.error || "Unknown error")
          );
          setIsLoading(false);
          return;
        }
      }

      if (data.success) {
        setMessage("Song added successfully!");
        resetFormState();
        // Refresh user songs if regular user
        if (isRegularUser && userArtistProfile) {
          await fetchUserArtistProfile();
        }
      } else {
        setMessage("Something went wrong! " + (data.error || ""));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while adding the song!";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [beatFile, setBeatFile] = useState<File | null>(null);

  const fetchSingers = async () => {
    try {
      const response = await fetch("/api/singers");
      const data = await response.json();
      setSingers(data);
    } catch (error) {
      console.error("Error fetching singers:", error);
    }
  };

  // Fetch singers on component mount (only for admin)
  useEffect(() => {
    if (isAdmin) {
      fetchSingers();
      fetchAdminMusics();
    }
  }, [isAdmin, fetchAdminMusics]);

  // Fetch user's artist profile (only for regular users)
  useEffect(() => {
    if (isRegularUser && user?.id) {
      fetchUserArtistProfile();
    }
  }, [isRegularUser, user?.id, fetchUserArtistProfile]);

  // Auto-suggest topic from song title
  useEffect(() => {
    const title = form.title.trim();
    if (!title || hasManualTopic) return;

    const timeout = setTimeout(async () => {
      setIsSuggestingTopic(true);
      try {
        const response = await fetch("/api/topic-suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });
        const data = await response.json();
        if (response.ok && data.topic) {
          setForm((prev) => ({ ...prev, topic: data.topic }));
        }
      } catch (error) {
        console.error("Error suggesting topic:", error);
      } finally {
        setIsSuggestingTopic(false);
      }
    }, 700);

    return () => clearTimeout(timeout);
  }, [form.title, hasManualTopic]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSrtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSrtFile(e.target.files[0]);
    }
  };

  const handleBeatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBeatFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle edit song
  const handleEditMusic = async () => {
    if (!selectedMusicId) {
      setMessage("Please select a song to edit!");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Upload files if needed
      let audioUrl = form.audio;
      let coverUrl = form.cover;
      let srtUrl = form.srt;
      let beatUrl = form.beat;

      if (file) {
        audioUrl = await uploadFileToR2(file, "Failed to upload mp3!");
      }

      if (imageFile) {
        coverUrl = await uploadFileToR2(imageFile, "Failed to upload image!");
      }

      if (srtFile) {
        srtUrl = await uploadFileToR2(srtFile, "Failed to upload SRT file!");
      }

      if (beatFile) {
        beatUrl = await uploadFileToR2(beatFile, "Failed to upload beat file!");
      }

      const selectedSinger = singers.find(
        (singer) => String(singer._id || singer.id) === selectedSingerId
      );
      const adminSingerName =
        isAdmin && useExistingSinger
          ? (selectedSinger?.singer ?? form.singer)
          : form.singer;

      let response: Response;
      if (isAdmin) {
        response = await fetch(`/api/musics/${selectedMusicId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            singer: adminSingerName,
            audio: audioUrl,
            cover: coverUrl,
            srt: srtUrl,
            beat: beatUrl,
          }),
        });
      } else {
        const singerId = userArtistProfile?._id || userArtistProfile?.id;
        if (!singerId) {
          setMessage("Singer profile not found!");
          setIsLoading(false);
          return;
        }
        response = await fetch(
          `/api/singers/${singerId}/musics/${selectedMusicId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              audio: audioUrl,
              cover: coverUrl,
              srt: srtUrl,
              beat: beatUrl,
            }),
          }
        );
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Song updated successfully!");
        resetFormState();
        if (isAdmin) {
          await fetchAdminMusics();
        } else {
          await fetchUserArtistProfile();
        }
      } else {
        setMessage(data.error || "An error occurred while editing!");
      }
    } catch (error) {
      console.error("Error editing music:", error);
      setMessage("An error occurred while editing!");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete song
  const handleDeleteMusic = async () => {
    if (!selectedMusicId) {
      setMessage("Please select a song to delete!");
      return;
    }

    if (!confirm("Are you sure you want to delete this song?")) return;

    setIsLoading(true);
    setMessage("");

    try {
      let response: Response;
      if (isAdmin) {
        response = await fetch(`/api/musics/${selectedMusicId}`, {
          method: "DELETE",
        });
      } else {
        const singerId = userArtistProfile?._id || userArtistProfile?.id;
        if (!singerId) {
          setMessage("Singer profile not found!");
          setIsLoading(false);
          return;
        }
        response = await fetch(
          `/api/singers/${singerId}/musics/${selectedMusicId}`,
          {
            method: "DELETE",
          }
        );
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Song deleted successfully!");
        setSelectedMusicId("");
        if (isAdmin) {
          await fetchAdminMusics();
        } else {
          await fetchUserArtistProfile();
        }
      } else {
        setMessage(data.error || "An error occurred while deleting!");
      }
    } catch (error) {
      console.error("Error deleting music:", error);
      setMessage("An error occurred while deleting!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMusicToManage = (musicId: string) => {
    setSelectedMusicId(musicId);
    if (!musicId) return;

    const sourceMusics = isAdmin ? adminMusics : userMusics;
    const selectedMusic = sourceMusics.find(
      (music) => (music._id || music.id || "") === musicId
    );

    if (!selectedMusic) return;

    const selectedTopic = String(
      (selectedMusic as { topic?: unknown }).topic ?? ""
    );
    const selectedSingerName = String(
      (selectedMusic as { singer?: unknown }).singer ?? ""
    ).trim();
    const selectedSingerIdFromMusic = String(
      (selectedMusic as { singerId?: unknown }).singerId ?? ""
    );
    const matchedSinger = singers.find((singer) => {
      const singerId = String(singer._id || singer.id || "");
      if (selectedSingerIdFromMusic && singerId === selectedSingerIdFromMusic) {
        return true;
      }
      return (
        singer.singer.trim().toLowerCase() === selectedSingerName.toLowerCase()
      );
    });

    setForm((prev) => ({
      ...prev,
      title: selectedMusic.title || "",
      singer: selectedSingerName,
      cover: selectedMusic.cover || "",
      audio: selectedMusic.audio || "",
      youtube: selectedMusic.youtube || "",
      content: selectedMusic.content || "",
      type: selectedMusic.type || "",
      topic: selectedTopic,
      srt: selectedMusic.srt || "",
      beat: selectedMusic.beat || "",
    }));
    setHasManualTopic(Boolean(selectedTopic));
    setFile(null);
    setImageFile(null);
    setSrtFile(null);
    setBeatFile(null);
    if (isAdmin && matchedSinger) {
      setUseExistingSinger(true);
      setSelectedSingerId(String(matchedSinger._id || matchedSinger.id || ""));
    } else if (isAdmin) {
      setUseExistingSinger(false);
      setSelectedSingerId("");
    }
  };

  return (
    <div>
      <MotionHeaderMusic name="New Music" />

      <div className="md:ml-6">
        <HeaderMusicPage name="New Music" />
      </div>

      <MenuBar />

      <div className="">
        <form
          className="left-6 z-30 mx-4 space-y-4 rounded-3xl border border-zinc-300 p-4 font-apple backdrop-blur-2xl dark:border-zinc-700 dark:to-white/10 md:ml-[270px]"
          onSubmit={handleSubmit}
        >
          <div className="text-center text-2xl font-bold"> New Song</div>

          {/* Info about singer selection */}
          {isAdmin && (
            <div className="rounded-xl border border-blue-400/30 bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              <div className="mb-1 font-semibold">
                How to add music (Admin):
              </div>

              <div className="space-y-1">
                <div>
                  • <strong>Choose existing singer:</strong> Song will be added
                  to that singer&apos;s list
                </div>

                <div>
                  • <strong>Enter a new singer:</strong> Song will be added to
                  the general musics collection
                </div>
              </div>
            </div>
          )}

          {isRegularUser && (
            <div className="rounded-lg border border-green-400/30 bg-green-50 p-3 text-sm text-green-800 dark:border-green-300/30 dark:bg-green-900/20 dark:text-green-300">
              <div className="mb-1 font-bold">Your singer profile info:</div>

              {isLoadingProfile ? (
                <div>Loading profile...</div>
              ) : userArtistProfile ? (
                <div className="space-y-1">
                  <div>
                    <strong>Singer name:</strong> {userArtistProfile.singer}
                  </div>

                  {userArtistProfile.cover && (
                    <div className="mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={userArtistProfile.cover}
                        alt={userArtistProfile.singer}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  Singer profile will be created automatically when you add your
                  first song with info:{" "}
                  <strong>{user?.displayName || user?.username}</strong>
                </div>
              )}
            </div>
          )}

          {isAdmin && adminMusics.length > 0 && (
            <div className="rounded-xl border border-blue-400/30 bg-blue-50 p-3 dark:border-blue-300/30 dark:bg-blue-900/20">
              <label className="mb-2 block text-sm font-semibold text-blue-700 dark:text-blue-300">
                Select song to edit / delete (system-wide)
              </label>
              <select
                value={selectedMusicId}
                onChange={(e) => handleSelectMusicToManage(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
              >
                <option value=""> Select a song</option>
                {adminMusics.map((music) => {
                  const id = music._id || music.id || "";
                  return (
                    <option key={id} value={id}>
                      {music.title}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className="flex w-full flex-col space-y-4">
            <div className="mx-auto flex w-full flex-col justify-between gap-4">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Song title
              </label>

              <input
                name="title"
                placeholder="Song title"
                value={form.title}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
              />

              {/* Singer selection - only for admin */}
              {isAdmin && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                    Singer
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useExistingSinger"
                      checked={useExistingSinger}
                      onChange={(e) => setUseExistingSinger(e.target.checked)}
                      disabled={isLoading}
                      className="rounded"
                    />

                    <label
                      htmlFor="useExistingSinger"
                      className="text-sm font-medium"
                    >
                      Use existing singer
                    </label>
                  </div>

                  {useExistingSinger ? (
                    <select
                      value={selectedSingerId}
                      onChange={(e) => {
                        const nextSingerId = e.target.value;
                        setSelectedSingerId(nextSingerId);
                        const nextSinger = singers.find(
                          (singer) =>
                            String(singer._id || singer.id) === nextSingerId
                        );
                        if (nextSinger) {
                          setForm((prev) => ({
                            ...prev,
                            singer: nextSinger.singer,
                          }));
                        }
                      }}
                      disabled={isLoading}
                      required={useExistingSinger}
                      className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                    >
                      <option value="">Select singer</option>

                      {singers.map((singer) => (
                        <option
                          key={singer._id || singer.id}
                          value={singer._id || singer.id}
                        >
                          {singer.singer}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name="singer"
                      placeholder="Enter new singer name"
                      value={form.singer}
                      onChange={handleChange}
                      required={!useExistingSinger}
                      disabled={isLoading}
                      className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                    />
                  )}
                </div>
              )}

              {/* For regular users: show their singer name (read-only) */}
              {isRegularUser && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Singer (auto from your account)
                  </label>

                  <input
                    type="text"
                    value={
                      userArtistProfile?.singer ||
                      user?.displayName ||
                      user?.username ||
                      ""
                    }
                    disabled
                    className="cursor-not-allowed rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-2 text-zinc-500 shadow-sm dark:border-zinc-900 dark:bg-zinc-900 dark:text-zinc-400"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-300 p-1 dark:border-zinc-700">
              <label className="px-3 pt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Cover image
              </label>

              {imageFile ? (
                <div className="font-semibold text-green-600">
                  Selected image file: {imageFile.name}
                </div>
              ) : (
                <input
                  name="cover"
                  placeholder="Select song image file below"
                  value={form.cover}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="pointer-events-none rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-800"
              />
            </div>

            {/* If an mp3 file is selected, hide audio link input */}
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-300 p-1 dark:border-zinc-700">
              <label className="px-3 pt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Song audio
              </label>

              {file ? (
                <div className="font-semibold text-green-600">
                  Selected mp3 file: {file.name}
                </div>
              ) : (
                <input
                  name="audio"
                  placeholder="Select song mp3 file below"
                  value={form.audio}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="pointer-events-none rounded-xl border bg-zinc-50 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                />
              )}

              <input
                type="file"
                accept=".mp3"
                onChange={handleFileChange}
                disabled={isLoading}
                className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-800"
              />
            </div>

            {/* Beat: allow selecting a file or entering a link */}
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-300 p-1 dark:border-zinc-700">
              <label className="px-3 pt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Beat
              </label>

              {beatFile ? (
                <div className="font-semibold text-green-600">
                  Selected beat file: {beatFile.name}
                </div>
              ) : (
                <input
                  name="beat"
                  placeholder="Select beat file below"
                  value={form.beat}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pointer-events-none rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                />
              )}

              <input
                type="file"
                accept="audio/*,.mp3,.wav,.m4a"
                onChange={handleBeatFileChange}
                disabled={isLoading}
                className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-800"
              />
            </div>

            {/* SRT: allow selecting a file or entering a link */}
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-300 p-1 dark:border-zinc-700">
              <label className="px-3 pt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Lyrics (SRT)
              </label>

              {srtFile ? (
                <div className="font-semibold text-green-600">
                  Selected SRT file: {srtFile.name}
                </div>
              ) : (
                <input
                  name="srt"
                  placeholder="Select lyrics SRT file below"
                  value={form.srt}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pointer-events-none rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                />
              )}

              <input
                type="file"
                accept=".srt,application/x-subrip"
                onChange={handleSrtFileChange}
                disabled={isLoading}
                className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-800"
              />
            </div>

            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Topic
            </label>

            <input
              name="topic"
              placeholder="Enter topic"
              value={form.topic}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />
            {isSuggestingTopic && (
              <div className="ml-4 text-xs text-zinc-500">
                Suggesting topic...
              </div>
            )}

            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Genre
            </label>

            <select
              name="type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              disabled={isLoading}
              required
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            >
              <option value="">Genre</option>

              <option value="pop">Pop</option>

              <option value="rock">Rock</option>

              <option value="hiphop">Hip Hop / Rap</option>

              <option value="rnb">R&B / Soul</option>

              <option value="edm">EDM / Electronic</option>

              <option value="jazz">Jazz</option>

              <option value="classical">Classical</option>

              <option value="country">Country</option>

              <option value="metal">Metal</option>

              <option value="folk">Folk</option>

              <option value="latin">Latin</option>

              <option value="soundtrack">Soundtrack / OST</option>

              <option value="world">World Music</option>

              <option value="chill">Chill / Lo-fi</option>

              <option value="acoustic">Acoustic</option>
            </select>

            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              YouTube link
            </label>

            <input
              name="youtube"
              placeholder="YouTube link"
              value={form.youtube}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />

            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Content
            </label>

            <textarea
              name="content"
              placeholder="Content"
              value={form.content}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />

            <div className="space-y-2">
              <Button
                type="submit"
                variant="liquid"
                size="lg"
                loading={isLoading}
                loadingText="Adding song..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-50 font-semibold text-black"
              >
                Add Song
              </Button>

              {isAdmin && adminMusics.length > 0 && (
                <div className="flex justify-between gap-2">
                  <Button
                    type="button"
                    onClick={handleEditMusic}
                    disabled={isLoading || !selectedMusicId}
                    className="w-full rounded-xl border border-blue-600 px-8 py-2 font-semibold"
                    variant="outline"
                  >
                    Edit
                  </Button>

                  <Button
                    type="button"
                    onClick={handleDeleteMusic}
                    disabled={isLoading || !selectedMusicId}
                    className="w-full rounded-xl border border-rose-600 px-8 py-2 font-semibold text-rose-600"
                    variant="outline"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
            {message && <p className="text-center font-semibold">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
