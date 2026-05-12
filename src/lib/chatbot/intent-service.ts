import { generateAnswer as geminiGenerateAnswer, isGeminiConfigured } from "./gemini-service";

const MUSIC_KEYWORDS = [
  "hãy hát",
  "hát đi",
  "hát một bài",
  "rap đi",
  "rap một đoạn",
  "rap cho",
  "phát nhạc",
  "mở nhạc",
  "bật nhạc",
  "chơi nhạc",
  "mở bài hát",
  "play music",
  "play a song",
  "music please",
  "sing",
  "sing a song",
  "nghe nhạc",
  "cho nghe nhạc",
  "bật bài",
  "mở bài",
];

const MUSIC_RECOMMENDATION_KEYWORDS = [
  "goi y nhac",
  "goi y bai hat",
  "de xuat nhac",
  "de xuat bai hat",
  "recommend music",
  "recommend a song",
  "suggest music",
  "suggest a song",
  "nghe gi bay gio",
  "bai nao hay",
  "nhac nao hay",
  "co bai nao hay",
  "playlist",
  "danh sach nhac",
];

const TRENDING_KEYWORDS = [
  "thinh hanh",
  "trending",
  "dang hot",
  "bai hot",
  "nhac hot",
  "top luot nghe",
  "nhieu luot nghe",
  "nghe nhieu",
  "popular",
  "chart",
  "bxh",
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

const hasKeywordMatch = (message: string) => {
  const normalizedMessage = normalize(message);
  return MUSIC_KEYWORDS.some((keyword) => normalizedMessage.includes(normalize(keyword)));
};

export const MUSIC_AUDIO_PAYLOAD = {
  answer: "Nghe thử nhé! Nếu chưa phát được, bạn nhấn nút play giúp mình.",
  audio: {
    url: "https://cdn.chanhdang.com/music_pl_3.mp3",
    autoPlay: true,
  },
};

export type MusicIntentKind =
  | "play"
  | "recommend"
  | "trending"
  | "by_singer"
  | "discover"
  | "none";

export type MusicIntentResult = {
  isMusicRequest: boolean;
  intent: MusicIntentKind;
  songTitle?: string;
  singerQuery?: string;
  discoverQuery?: string;
};

/**
 * Extract song title from message
 * Examples: "mở bài Hồng Nhan", "phát Bạc Phận", "cho nghe Sóng Gió"
 */
const extractSongTitle = (message: string): string | null => {
  const patterns = [
    /(?:mở|phát|bật|chơi|nghe|hát|rap)\s+bài\s+["']?([^"']+)["']?/i,
    /(?:mở|phát|bật|chơi)\s+["']?([^"']+)["']?\s*(?:đi|nào|nhé|thử)?$/i,
    /(?:cho\s+)?(?:mình\s+)?(?:nghe|hát|phát|mở|bật)\s+(?:bài\s+)?["']?([^"']+)["']?/i,
    /["']([^"']+)["']\s*(?:đi|nào|nhé|thử)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const title = match[1].trim();
      const cleaned = title
        .replace(/^(bài|bài hát|nhạc|song|music)\s+/i, "")
        .replace(/\s+(đi|nào|nhé|thử|cho mình|cho tôi)$/i, "")
        .trim();

      if (
        cleaned.length > 1 &&
        cleaned.length < 100 &&
        !/^(nhạc|của|nhà)\s/i.test(cleaned)
      ) {
        return cleaned;
      }
    }
  }

  return null;
};

const tailCleanup = (s: string) =>
  s
    .replace(/\s+(đi|nào|nhé|thử|please|giúp mình|cho mình|cho tôi|giúp tôi)\s*$/i, "")
    .replace(/[.!?]+$/g, "")
    .trim();

/** "nhạc của X", "ca sĩ X", "songs by X" */
const extractSingerQuery = (message: string): string | null => {
  const patterns = [
    /(?:nhạc|playlist)\s+(?:của|nhà|from)\s+(.+)/i,
    /bài(?:\s+hát)?\s+(?:của|nhà|from)\s+(.+)/i,
    /ca\s*sĩ\s+(.+)/i,
    /nghệ\s*sĩ\s+(.+)/i,
    /songs?\s+by\s+(.+)/i,
    /artist\s+(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) {
      const cleaned = tailCleanup(match[1].trim());
      if (cleaned.length >= 2 && cleaned.length < 120) {
        return cleaned;
      }
    }
  }

  return null;
};

const isTrendingRequest = (message: string) => {
  const n = normalize(message);
  return TRENDING_KEYWORDS.some((k) => n.includes(normalize(k)));
};

const isRecommendationKeywordMatch = (message: string) => {
  const n = normalize(message);
  return MUSIC_RECOMMENDATION_KEYWORDS.some((keyword) => n.includes(keyword));
};

/** Mood / thể loại / ngữ cảnh nghe — dùng để tìm trong type, topic, title. */
const DISCOVER_HINTS = [
  "chill",
  "buon",
  "buồn",
  "vui",
  "edm",
  "rap",
  "hip hop",
  "hiphop",
  "ballad",
  "acoustic",
  "remix",
  "lofi",
  "lo-fi",
  "deep",
  "study",
  "focus",
  "party",
  "tinh yeu",
  "tinhyeu",
  "love",
  "pop",
  "rock",
  "jazz",
  "indie",
  "karaoke",
  "beat",
  "night",
  "dem khuya",
  "lam viec",
  "tap gym",
  "gym",
  "sleep",
  "ngu",
];

const hasDiscoverHints = (message: string) => {
  const n = normalize(message);
  return DISCOVER_HINTS.some((h) => n.includes(normalize(h)));
};

export const detectMusicIntent = async (message: string): Promise<MusicIntentResult> => {
  const text = message.trim();
  if (!text) {
    return { isMusicRequest: false, intent: "none" };
  }

  if (isTrendingRequest(text)) {
    return { isMusicRequest: true, intent: "trending" };
  }

  const singerFirst =
    /(?:nhạc|bài|playlist)\s+(?:của|nhà|from)\b/i.test(text) ||
    /ca\s*sĩ\b/i.test(text) ||
    /nghệ\s*sĩ\b/i.test(text) ||
    /\bby\s+\w/i.test(text);
  if (singerFirst) {
    const singerQuery = extractSingerQuery(text);
    if (singerQuery) {
      return { isMusicRequest: true, intent: "by_singer", singerQuery };
    }
  }

  const songTitle = extractSongTitle(text);
  if (songTitle) {
    return {
      isMusicRequest: true,
      intent: "play",
      songTitle,
    };
  }

  const fallbackSinger = extractSingerQuery(text);
  if (fallbackSinger) {
    return { isMusicRequest: true, intent: "by_singer", singerQuery: fallbackSinger };
  }

  const normalizedText = normalize(text);
  const isRecommendationRequest = isRecommendationKeywordMatch(text);
  if (isRecommendationRequest) {
    if (hasDiscoverHints(text)) {
      return { isMusicRequest: true, intent: "discover", discoverQuery: text };
    }
    return { isMusicRequest: true, intent: "recommend" };
  }

  if (hasDiscoverHints(text) && hasKeywordMatch(text)) {
    return { isMusicRequest: true, intent: "discover", discoverQuery: text };
  }

  if (hasKeywordMatch(text)) {
    return { isMusicRequest: true, intent: "play" };
  }

  if (!isGeminiConfigured()) {
    return { isMusicRequest: false, intent: "none" };
  }

  try {
    const result = await geminiGenerateAnswer({
      context:
        "Bạn là bộ phân loại ý định người dùng cho chatbot âm nhạc ChanhDang Music.\n\n" +
        "Trả lời ĐÚNG một dòng theo một trong các dạng:\n" +
        "- trending — muốn nghe nhạc hot / nhiều lượt nghe / đang thịnh hành\n" +
        "- singer: [tên ca sĩ hoặc nghệ sĩ] — muốn nhạc của một nghệ sĩ cụ thể\n" +
        "- discover: [từ khóa ngắn] — gợi ý theo mood / thể loại / ngữ cảnh (chill, rap, buồn, làm việc…)\n" +
        "- play: [tên bài hát] — muốn phát một bài cụ thể\n" +
        "- play — mở nhạc chung, không chỉ rõ bài\n" +
        "- recommend — muốn được gợi ý playlist / vài bài bất kỳ\n" +
        "- no — không phải yêu cầu liên quan phát hoặc gợi ý nhạc\n\n" +
        "Ví dụ trending: 'có bài nào đang hot không', 'top lượt nghe'\n" +
        "Ví dụ singer: 'nhạc của Sơn Tùng', 'ca sĩ Mono'\n" +
        "Ví dụ discover: 'gợi ý nhạc chill', 'vài bài rap hay'\n" +
        "Ví dụ play cụ thể: 'mở bài Lạc Trôi'\n" +
        "KHÔNG phải nhạc: 'Bạn thích nhạc gì?' (chỉ hỏi chuyện), 'Giới thiệu dự án'\n\n" +
        "Chỉ một dòng, đúng format.",
      question: `Người dùng nói: "${text}"`,
      language: "vi",
      allowGeneral: true,
    });

    if (!result) {
      return { isMusicRequest: false, intent: "none" };
    }

    const line = result.trim();
    const answer = normalize(line);

    if (answer.startsWith("trending")) {
      return { isMusicRequest: true, intent: "trending" };
    }

    if (/^singer\s*:/i.test(line)) {
      const name = tailCleanup(line.replace(/^singer\s*:/i, "").trim());
      if (name.length >= 1) {
        return { isMusicRequest: true, intent: "by_singer", singerQuery: name };
      }
    }

    if (/^discover\s*:/i.test(line)) {
      const q = tailCleanup(line.replace(/^discover\s*:/i, "").trim());
      if (q.length >= 1) {
        return { isMusicRequest: true, intent: "discover", discoverQuery: q };
      }
    }

    if (/^play\s*:/i.test(line)) {
      const extractedTitle = tailCleanup(line.replace(/^play\s*:/i, "").trim());
      if (extractedTitle.length > 0) {
        return {
          isMusicRequest: true,
          intent: "play",
          songTitle: extractedTitle,
        };
      }
    }

    if (answer.startsWith("recommend")) {
      return { isMusicRequest: true, intent: "recommend" };
    }

    if (answer.startsWith("play")) {
      return { isMusicRequest: true, intent: "play" };
    }

    return { isMusicRequest: false, intent: "none" };
  } catch (error) {
    console.error("[intent-service] detectMusicIntent error:", error);
    return { isMusicRequest: false, intent: "none" };
  }
};

const THEME_LIGHT_KEYWORDS = [
  "mở giao diện sáng",
  "bật giao diện sáng",
  "chuyển sang sáng",
  "chuyển sang light mode",
  "bật light mode",
  "mở light mode",
  "giao diện sáng",
  "chế độ sáng",
  "light mode",
  "sáng lên",
  "sáng hơn",
];

const THEME_DARK_KEYWORDS = [
  "mở giao diện tối",
  "bật giao diện tối",
  "chuyển sang tối",
  "chuyển sang dark mode",
  "bật dark mode",
  "mở dark mode",
  "giao diện tối",
  "chế độ tối",
  "dark mode",
  "tối đi",
  "tối hơn",
];

export type ThemeIntent = "light" | "dark" | null;

export const detectThemeIntent = async (message: string): Promise<ThemeIntent> => {
  const text = message.trim();
  if (!text) {
    return null;
  }

  const normalizedMessage = normalize(text);

  const hasLightKeyword = THEME_LIGHT_KEYWORDS.some((keyword) =>
    normalizedMessage.includes(normalize(keyword))
  );
  if (hasLightKeyword) {
    return "light";
  }

  const hasDarkKeyword = THEME_DARK_KEYWORDS.some((keyword) =>
    normalizedMessage.includes(normalize(keyword))
  );
  if (hasDarkKeyword) {
    return "dark";
  }

  if (!isGeminiConfigured()) {
    return null;
  }

  try {
    const result = await geminiGenerateAnswer({
      context:
        "Bạn là bộ phân loại ý định người dùng. Nhiệm vụ của bạn là xác định xem người dùng có muốn thay đổi giao diện (theme/mode) của trang web không.\n\n" +
        "Các ví dụ yêu cầu chuyển sang LIGHT MODE (giao diện sáng):\n" +
        "- 'Mở giao diện sáng', 'Bật light mode', 'Chuyển sang sáng', 'Giao diện sáng lên', 'Sáng hơn đi'\n" +
        "- 'Cho mình xem giao diện sáng', 'Có thể chuyển sang chế độ sáng không?', 'Mình muốn giao diện sáng'\n" +
        "- 'Turn on light mode', 'Switch to light theme', 'Make it brighter'\n\n" +
        "Các ví dụ yêu cầu chuyển sang DARK MODE (giao diện tối):\n" +
        "- 'Mở giao diện tối', 'Bật dark mode', 'Chuyển sang tối', 'Giao diện tối đi', 'Tối hơn đi'\n" +
        "- 'Cho mình xem giao diện tối', 'Có thể chuyển sang chế độ tối không?', 'Mình muốn giao diện tối'\n" +
        "- 'Turn on dark mode', 'Switch to dark theme', 'Make it darker'\n\n" +
        "Các ví dụ KHÔNG phải yêu cầu chuyển theme:\n" +
        "- 'Giao diện này đẹp quá', 'Bạn thích giao diện nào?', 'Giao diện hiện tại là gì?' (chỉ là câu hỏi/bình luận)\n" +
        "- 'Mình thích giao diện sáng' (chỉ là sở thích, không phải yêu cầu)\n\n" +
        "Chỉ trả lời:\n" +
        "- 'light' nếu người dùng YÊU CẦU chuyển sang giao diện sáng\n" +
        "- 'dark' nếu người dùng YÊU CẦU chuyển sang giao diện tối\n" +
        "- 'no' nếu không phải yêu cầu chuyển theme\n\n" +
        "Chỉ trả lời một từ: 'light', 'dark', hoặc 'no'.",
      question: `Người dùng nói: "${text}"\n\nĐây có phải là yêu cầu chuyển đổi giao diện không? Nếu có, chuyển sang sáng hay tối?`,
      language: "vi",
      allowGeneral: true,
    });

    if (!result) {
      return null;
    }

    const answer = normalize(result.trim());
    if (
      answer === "light" ||
      answer.includes("light") ||
      answer.includes("sang") ||
      answer.startsWith("light")
    ) {
      return "light";
    }
    if (
      answer === "dark" ||
      answer.includes("dark") ||
      answer.includes("toi") ||
      answer.startsWith("dark")
    ) {
      return "dark";
    }
    return null;
  } catch (error) {
    console.error("[intent-service] detectThemeIntent error:", error);
    return null;
  }
};
