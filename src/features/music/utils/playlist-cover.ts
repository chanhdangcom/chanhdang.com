export const DEFAULT_PLAYLIST_COVER = "/img/Logomark.png";
export const PLAYLIST_COLLAGE_PREFIX = "playlist-collage:";

const isValidCoverUrl = (value: string) => {
  if (!value) return false;
  if (
    value.startsWith("/") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const normalizeCoverValue = (value?: string | null) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return isValidCoverUrl(trimmed) ? trimmed : "";
};

export const parsePlaylistCoverCollage = (cover?: string | null) => {
  if (!cover?.startsWith(PLAYLIST_COLLAGE_PREFIX)) {
    return [];
  }

  try {
    const raw = cover.slice(PLAYLIST_COLLAGE_PREFIX.length);
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => normalizeCoverValue(typeof item === "string" ? item : ""))
      .filter(Boolean)
      .slice(0, 5);
  } catch {
    return [];
  }
};

export const createPlaylistCoverValue = (
  covers: Array<string | null | undefined>,
  fallbackCover?: string | null
) => {
  const normalized = Array.from(
    new Set(covers.map((cover) => normalizeCoverValue(cover)).filter(Boolean))
  ).slice(0, 5);

  if (normalized.length >= 2) {
    return `${PLAYLIST_COLLAGE_PREFIX}${encodeURIComponent(
      JSON.stringify(normalized)
    )}`;
  }

  return normalized[0] || normalizeCoverValue(fallbackCover) || DEFAULT_PLAYLIST_COVER;
};

export const getPlaylistCoverTiles = (cover?: string | null) => {
  const collage = parsePlaylistCoverCollage(cover);
  if (collage.length > 0) {
    return collage;
  }

  return [normalizeCoverValue(cover) || DEFAULT_PLAYLIST_COVER];
};

export const getPlaylistCoverPreviewUrl = (cover?: string | null) => {
  const collage = parsePlaylistCoverCollage(cover);
  if (collage.length > 0) {
    return collage[0] || DEFAULT_PLAYLIST_COVER;
  }

  return normalizeCoverValue(cover) || DEFAULT_PLAYLIST_COVER;
};
