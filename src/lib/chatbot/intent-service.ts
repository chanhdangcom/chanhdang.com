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

export type MusicIntentResult = {
  isMusicRequest: boolean;
  songTitle?: string; // Tên bài hát nếu được yêu cầu cụ thể
};

/**
 * Extract song title from message
 * Examples: "mở bài Hồng Nhan", "phát Bạc Phận", "cho nghe Sóng Gió"
 */
const extractSongTitle = (message: string): string | null => {
  // Patterns to extract song title
  const patterns = [
    /(?:mở|phát|bật|chơi|nghe|hát|rap)\s+(?:bài\s+)?(?:hát\s+)?["']?([^"']+)["']?/i,
    /(?:cho\s+)?(?:mình\s+)?(?:nghe|hát|phát|mở|bật)\s+(?:bài\s+)?["']?([^"']+)["']?/i,
    /["']([^"']+)["']\s*(?:đi|nào|nhé|thử)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const title = match[1].trim();
      // Remove common words that might be part of the request
      const cleaned = title
        .replace(/^(bài|bài hát|nhạc|song|music)\s+/i, "")
        .replace(/\s+(đi|nào|nhé|thử|cho mình|cho tôi)$/i, "")
        .trim();
      
      if (cleaned.length > 1 && cleaned.length < 100) {
        return cleaned;
      }
    }
  }

  return null;
};

export const detectMusicIntent = async (message: string): Promise<MusicIntentResult> => {
  const text = message.trim();
  if (!text) {
    return { isMusicRequest: false };
  }

  // Try to extract song title first
  const songTitle = extractSongTitle(text);
  
  // If we found a song title, it's definitely a music request
  if (songTitle) {
    return {
      isMusicRequest: true,
      songTitle,
    };
  }

  // Fast path: keyword matching for common cases
  if (hasKeywordMatch(text)) {
    return { isMusicRequest: true };
  }

  // Use AI for natural language understanding
  if (!isGeminiConfigured()) {
    return { isMusicRequest: false };
  }

  try {
    const result = await geminiGenerateAnswer({
      context:
        "Bạn là bộ phân loại ý định người dùng. Nhiệm vụ của bạn là xác định xem người dùng có muốn nghe nhạc, hát, rap, hoặc phát audio không.\n\n" +
        "Các ví dụ yêu cầu phát nhạc:\n" +
        "- 'Cho mình nghe nhạc đi', 'Muốn nghe bài hát', 'Có thể hát cho mình nghe không?', 'Mở nhạc lên đi', 'Play music', 'Sing a song'\n" +
        "- 'Bạn có thể hát không?', 'Hát một bài đi', 'Rap cho mình nghe', 'Phát nhạc đi'\n" +
        "- 'Mở bài Hồng Nhan', 'Phát Bạc Phận', 'Cho nghe Sóng Gió' (yêu cầu bài hát cụ thể)\n\n" +
        "Các ví dụ KHÔNG phải yêu cầu phát nhạc:\n" +
        "- 'Bạn thích nhạc gì?', 'Giới thiệu bài hát', 'Nhạc của ai hay?', 'Mình thích nhạc pop'\n" +
        "- 'Bạn có biết hát không?', 'Bạn có nghe nhạc không?' (chỉ là câu hỏi, không phải yêu cầu)\n\n" +
        "Nếu người dùng yêu cầu một bài hát cụ thể, trả lời theo format: 'Có: [tên bài hát]'\n" +
        "Nếu chỉ là yêu cầu phát nhạc chung, trả lời 'Có'\n" +
        "Nếu không phải yêu cầu phát nhạc, trả lời 'Không'",
      question: `Người dùng nói: "${text}"\n\nĐây có phải là yêu cầu phát nhạc, hát, hoặc rap không? Nếu có bài hát cụ thể, hãy trích xuất tên bài hát.`,
      language: "vi",
      allowGeneral: true,
    });

    if (!result) {
      return { isMusicRequest: false };
    }

    const answer = normalize(result.trim());
    
    // Check if AI detected a specific song
    if (answer.includes("co:") || answer.includes("yes:")) {
      const parts = answer.split(":");
      if (parts.length > 1) {
        const extractedTitle = parts.slice(1).join(":").trim();
        if (extractedTitle.length > 0) {
          return {
            isMusicRequest: true,
            songTitle: extractedTitle,
          };
        }
      }
    }

    // Check if it's a general music request
    const isMusicRequest =
      answer === "co" ||
      answer === "yes" ||
      answer.includes("co") ||
      answer.includes("yes") ||
      answer.startsWith("co") ||
      answer.startsWith("yes");

    return { isMusicRequest };
  } catch (error) {
    console.error("[intent-service] detectMusicIntent error:", error);
    return { isMusicRequest: false };
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

  // Fast path: keyword matching for common cases
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

  // Use AI for natural language understanding
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
    // More flexible matching for AI responses
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

