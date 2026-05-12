import { fetchFacts } from "@/lib/chatbot/facts-repository";
import { detectMusicIntent, detectThemeIntent } from "@/lib/chatbot/intent-service";
import { generateAnswer, hasLLMSupport } from "@/lib/chatbot/model-gateway";
import { buildLLMResponse, buildSimilarityResponse } from "@/lib/chatbot/response-service";
import type { ChatAction, ChatApiResponse, ChatMusic } from "@/lib/chatbot/contracts";
import {
  getMusicRecommendations,
  searchMusicByTitle,
  searchMusicCandidates,
  getTrendingMusicRecommendations,
  searchMusicBySingerName,
  searchMusicByMoodOrGenre,
  mergeUniqueMusicLists,
  type MusicResult,
} from "@/lib/chatbot/music-search-service";

export const dynamic = "force-dynamic";

interface ChatRequest {
  message?: string;
  language?: string;
}

const toChatMusic = (music: MusicResult): ChatMusic => ({
  id: music.id,
  title: music.title,
  singer: music.singer,
  cover: music.cover,
  audio: music.audio,
  youtube: music.youtube,
  content: music.content,
  type: music.type,
});

const buildMusicActionsAndAnswer = async ({
  message,
  language,
  tracks,
  autoPlayFirst,
  mode,
  suggestionReason,
  matchedTrackOverride,
}: {
  message: string;
  language: string;
  tracks: MusicResult[];
  autoPlayFirst: boolean;
  mode: "play" | "recommend";
  suggestionReason: "related" | "fallback" | "recommendation";
  matchedTrackOverride?: MusicResult | null;
}): Promise<{ answer: string; actions: ChatAction[] }> => {
  const actions: ChatAction[] = [];
  const [first, ...rest] = tracks;
  const suggestionPool = autoPlayFirst ? rest : tracks;
  const limitedSuggestions = suggestionPool.slice(0, autoPlayFirst ? 4 : 6);

  if (autoPlayFirst && first) {
    actions.push({
      type: "play-music",
      track: toChatMusic(first),
      autoPlay: true,
    });
  }

  if (limitedSuggestions.length > 0) {
    actions.push({
      type: "suggest-music",
      tracks: limitedSuggestions.map(toChatMusic),
      reason: suggestionReason,
    });
  }

  const matched =
    matchedTrackOverride !== undefined
      ? matchedTrackOverride
      : autoPlayFirst
        ? first ?? null
        : null;
  const suggestionsForText =
    autoPlayFirst && first
      ? [first, ...limitedSuggestions]
      : limitedSuggestions;

  const answer = await createMusicAnswer({
    message,
    language,
    matchedTrack: matched,
    suggestions: suggestionsForText,
    mode,
  });

  return { answer, actions };
};

const createMusicAnswer = async ({
  message,
  language,
  matchedTrack,
  requestedTitle,
  suggestions = [],
  mode,
}: {
  message: string;
  language: string;
  matchedTrack?: MusicResult | null;
  requestedTitle?: string;
  suggestions?: MusicResult[];
  mode: "play" | "recommend";
}) => {
  const suggestionText =
    suggestions.length > 0
      ? suggestions
          .slice(0, 3)
          .map((track, index) => `${index + 1}. ${track.title} - ${track.singer}`)
          .join("\n")
      : "Không có gợi ý bổ sung.";

  const fallback =
    mode === "play"
      ? matchedTrack
        ? `Mình tìm thấy bài "${matchedTrack.title}" của ${matchedTrack.singer} trong thư viện và đã mở giúp bạn rồi.`
        : requestedTitle
          ? `Mình chưa thấy bài "${requestedTitle}" trong thư viện. Mình gợi ý vài bài gần nhất để bạn chọn nhé.`
          : "Mình đã chọn một bài trong thư viện để mở cho bạn rồi."
      : suggestions.length > 0
        ? "Mình gợi ý cho bạn vài bài đang có trong thư viện, bạn chọn thử bài hợp mood nhé."
        : "Hiện mình chưa có đủ bài phù hợp để gợi ý ngay lúc này.";

  if (!hasLLMSupport()) {
    return fallback;
  }

  try {
    const context = matchedTrack
      ? `Người dùng muốn nghe nhạc.
Tin nhắn: ${message}
${requestedTitle ? `Bài được yêu cầu: ${requestedTitle}` : "Không có tên bài cụ thể."}
Kết quả khớp trong thư viện:
- ${matchedTrack.title} - ${matchedTrack.singer}
- Audio nội bộ: có

Gợi ý thêm:
${suggestionText}`
      : `Người dùng muốn ${mode === "recommend" ? "được gợi ý nhạc" : "phát nhạc"}.
Tin nhắn: ${message}
${requestedTitle ? `Bài được yêu cầu nhưng không tìm thấy: ${requestedTitle}` : "Không có tên bài cụ thể."}

Các bài có thể gợi ý trong thư viện:
${suggestionText}`;

    const answer = await generateAnswer({
      context,
      question:
        mode === "recommend"
          ? "Hãy trả lời thân thiện bằng tiếng Việt, ngắn gọn 2-4 câu, giới thiệu vài bài hợp lý và mời người dùng chọn."
          : "Hãy trả lời thân thiện bằng tiếng Việt, ngắn gọn 2-4 câu. Nếu đã có bài khớp thì nói rằng đã mở bài. Nếu không tìm thấy đúng bài thì xin lỗi nhẹ và giới thiệu các bài gợi ý.",
      language,
      allowGeneral: true,
    });

    return answer?.trim() || fallback;
  } catch (error) {
    console.error("[ncdang-chat] createMusicAnswer error:", error);
    return fallback;
  }
};

export async function POST(request: Request) {
  let payload: ChatRequest;

  try {
    payload = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({ error: "Payload không hợp lệ." }, { status: 400 });
  }

  const message = payload.message?.trim() ?? "";
  if (!message) {
    return Response.json({ error: "Vui lòng nhập nội dung câu hỏi." }, { status: 400 });
  }

  const language = payload.language?.trim() || getEnv("NCDANG_BOT_DEFAULT_LANGUAGE") || "vi";

  try {
    const musicIntentPromise = detectMusicIntent(message).catch((error) => {
      console.error("[ncdang-chat] detectMusicIntent error:", error);
      return { isMusicRequest: false, intent: "none" } as const;
    });

    const themeIntentPromise = detectThemeIntent(message).catch((error) => {
      console.error("[ncdang-chat] detectThemeIntent error:", error);
      return null;
    });

    const factsPromise = fetchFacts(language);

    const [facts, musicIntent, themeIntent] = await Promise.all([
      factsPromise,
      musicIntentPromise,
      themeIntentPromise,
    ]);

    if (musicIntent.isMusicRequest) {
      const requestedTitle = musicIntent.songTitle?.trim();

      if (musicIntent.intent === "trending") {
        const tracks = await getTrendingMusicRecommendations(6);
        const { answer, actions } = await buildMusicActionsAndAnswer({
          message,
          language,
          tracks: tracks.length > 0 ? tracks : await getMusicRecommendations(4),
          autoPlayFirst: true,
          mode: "play",
          suggestionReason: "related",
        });
        return Response.json({
          answer,
          actions,
          meta: { intent: "music-trending" },
        } satisfies ChatApiResponse);
      }

      if (musicIntent.intent === "by_singer") {
        const sq = musicIntent.singerQuery?.trim();
        let tracks = sq ? await searchMusicBySingerName(sq, 6) : [];
        let autoPlayFirst = tracks.length > 0;
        if (tracks.length === 0) {
          tracks = mergeUniqueMusicLists(
            [await getTrendingMusicRecommendations(5), await getMusicRecommendations(4)],
            8
          );
          autoPlayFirst = false;
        }
        const { answer, actions } = await buildMusicActionsAndAnswer({
          message,
          language,
          tracks,
          autoPlayFirst,
          mode: autoPlayFirst ? "play" : "recommend",
          suggestionReason: autoPlayFirst ? "related" : "fallback",
          matchedTrackOverride: autoPlayFirst ? undefined : null,
        });
        return Response.json({
          answer,
          actions,
          meta: { intent: "music-by-singer" },
        } satisfies ChatApiResponse);
      }

      if (musicIntent.intent === "discover") {
        const q = musicIntent.discoverQuery?.trim() || message;
        let tracks = await searchMusicByMoodOrGenre(q, 8);
        if (tracks.length < 3) {
          tracks = mergeUniqueMusicLists(
            [tracks, await getTrendingMusicRecommendations(5), await getMusicRecommendations(3)],
            8
          );
        }
        const finalTracks =
          tracks.length > 0 ? tracks : await getMusicRecommendations(4);
        const { answer, actions } = await buildMusicActionsAndAnswer({
          message,
          language,
          tracks: finalTracks,
          autoPlayFirst: finalTracks.length > 0,
          mode: "recommend",
          suggestionReason: "recommendation",
          matchedTrackOverride: null,
        });
        return Response.json({
          answer,
          actions,
          meta: { intent: "music-discover" },
        } satisfies ChatApiResponse);
      }

      if (musicIntent.intent === "recommend") {
        const fromMood = await searchMusicByMoodOrGenre(message, 6);
        const trending = await getTrendingMusicRecommendations(4);
        const random = await getMusicRecommendations(3);
        const merged = mergeUniqueMusicLists([fromMood, trending, random], 8);
        const tracks =
          merged.length > 0 ? merged : (await getMusicRecommendations(4));
        const { answer, actions } = await buildMusicActionsAndAnswer({
          message,
          language,
          tracks,
          autoPlayFirst: false,
          mode: "recommend",
          suggestionReason: "recommendation",
          matchedTrackOverride: null,
        });
        return Response.json({
          answer,
          actions,
          meta: { intent: "music-suggest" },
        } satisfies ChatApiResponse);
      }

      if (musicIntent.intent === "play") {
        const actions: ChatAction[] = [];
        const matchedTrack = requestedTitle
          ? await searchMusicByTitle(requestedTitle)
          : (await getTrendingMusicRecommendations(1))[0] ??
            (await getMusicRecommendations(1))[0] ??
            null;
        const relatedTracks = requestedTitle
          ? await searchMusicCandidates(requestedTitle, 3)
          : await getTrendingMusicRecommendations(3);
        const suggestions = relatedTracks.filter((track) => track.id !== matchedTrack?.id);

        if (matchedTrack) {
          actions.push({
            type: "play-music",
            track: toChatMusic(matchedTrack),
            autoPlay: true,
          });
        }

        if (suggestions.length > 0) {
          actions.push({
            type: "suggest-music",
            tracks: suggestions.slice(0, 3).map(toChatMusic),
            reason: matchedTrack ? "related" : "fallback",
          });
        }

        const answer = await createMusicAnswer({
          message,
          language,
          matchedTrack,
          requestedTitle,
          suggestions,
          mode: "play",
        });

        const response: ChatApiResponse = {
          answer,
          actions,
          meta: { intent: "music-play" },
        };

        return Response.json(response);
      }
    }

    if (themeIntent) {
      const themeMessages: Record<"light" | "dark", string> = {
        light: "Đã chuyển sang giao diện sáng rồi nhé! ",
        dark: "Đã chuyển sang giao diện tối rồi nhé! ",
      };
      const response: ChatApiResponse = {
        answer: themeMessages[themeIntent],
        actions: [{ type: "theme", value: themeIntent }],
        meta: { intent: "theme" },
      };
      return Response.json(response);
    }

    let answer: string | undefined;
    const hasLLM = hasLLMSupport();

    if (hasLLM) {
      try {
        const llmAnswer = await buildLLMResponse(facts, message, language);
        answer = llmAnswer ?? undefined;
      } catch (error) {
        console.error("[ncdang-chat] llm error", error);
      }
    }

    if (!answer) {
      answer = buildSimilarityResponse(facts, message, language);
    }

    const response: ChatApiResponse = {
      answer,
      meta: { intent: "chat" },
    };

    return Response.json(response);
  } catch (error) {
    console.error("[ncdang-chat] internal error", error);
    return Response.json({ 
      error: "Server gặp lỗi, thử lại sau.",
      details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 });
  }
}

function getEnv(key: string) {
  return process.env[key];
}

