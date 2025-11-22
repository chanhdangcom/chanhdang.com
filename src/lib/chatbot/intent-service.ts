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

export const detectMusicIntent = async (message: string) => {
  const text = message.trim();
  if (!text) {
    return false;
  }

  if (hasKeywordMatch(text)) {
    return true;
  }

  if (!isGeminiConfigured()) {
    return false;
  }

  try {
    const result = await geminiGenerateAnswer({
      context:
        "Bạn là bộ phân loại ý định. Xác định xem người dùng có yêu cầu bạn hát, rap hoặc phát/mở nhạc không. " +
        "Nếu đúng là yêu cầu phát nhạc, hãy trả lời duy nhất 'Có'. Nếu không, trả lời 'Không'. Không giải thích thêm.",
      question: `Người dùng nói: "${text}". Đây có phải là yêu cầu phát nhạc, rap hoặc hát không?`,
      language: "vi",
      allowGeneral: true,
    });

    if (!result) {
      return false;
    }

    const answer = normalize(result.trim());
    return answer === "co" || answer === "yes";
  } catch (error) {
    console.error("[intent-service] detectMusicIntent error:", error);
    return false;
  }
};

